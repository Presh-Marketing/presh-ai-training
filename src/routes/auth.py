from flask import Blueprint, request, jsonify, session, redirect, url_for
from authlib.integrations.flask_client import OAuth
try:
    from src.models.training import db, User, LearningActivity  # type: ignore
except ModuleNotFoundError:
    from models.training import db, User, LearningActivity  # type: ignore
import os
import os
import secrets

auth_bp = Blueprint('auth', __name__)

# OAuth configuration
oauth = OAuth()

# Allowed email domain (configurable via env)
ALLOWED_DOMAIN = os.getenv('ALLOWED_DOMAIN', 'presh.ai')
# Explicit auth provider selection: 'stack' or 'google'
AUTH_PROVIDER = os.getenv('AUTH_PROVIDER', 'stack').strip().lower()

def _get_frontend_origin():
    fo = os.getenv('FRONTEND_ORIGIN', '') or ''
    # Remove all whitespace characters including newlines, tabs, etc.
    fo = ''.join(fo.split())
    return fo.rstrip('/') if fo else ''

def init_oauth(app):
    oauth.init_app(app)

    # Prefer provider from env; support fallback
    if AUTH_PROVIDER == 'google':
        return oauth.register(
            name='google',
            client_id=os.getenv('GOOGLE_CLIENT_ID', 'your-google-client-id'),
            client_secret=os.getenv('GOOGLE_CLIENT_SECRET', 'your-google-client-secret'),
            server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
            client_kwargs={'scope': 'openid email profile'}
        )

    # Stack Auth (attempt), then fallback to Google
    stack_project_id = os.getenv('STACK_PROJECT_ID') or os.getenv('NEXT_PUBLIC_STACK_PROJECT_ID')
    stack_client_id = os.getenv('STACK_PUBLISHABLE_CLIENT_KEY') or os.getenv('NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY')
    stack_client_secret = os.getenv('STACK_SECRET_SERVER_KEY')
    stack_metadata_url = (
        os.getenv('STACK_OIDC_METADATA_URL')
        or (f'https://api.stack-auth.com/api/v1/projects/{stack_project_id}/.well-known/openid-configuration' if stack_project_id else None)
    )

    if stack_client_id and stack_client_secret and stack_metadata_url:
        try:
            return oauth.register(
                name='stack',
                client_id=stack_client_id,
                client_secret=stack_client_secret,
                server_metadata_url=stack_metadata_url,
                client_kwargs={'scope': 'openid email profile'}
            )
        except Exception:
            pass

    # Fallback to Google
    return oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID', 'your-google-client-id'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET', 'your-google-client-secret'),
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

def _resolve_provider():
    if AUTH_PROVIDER == 'google':
        prov = getattr(oauth, 'google', None)
        if prov is not None:
            return prov
    else:
        prov = getattr(oauth, 'stack', None)
        if prov is not None:
            return prov
    return getattr(oauth, 'google', None)

def is_authorized_domain(email):
    """Check if email belongs to authorized domain"""
    return email.lower().endswith(f'@{ALLOWED_DOMAIN}')

@auth_bp.route('/login', methods=['GET'])
def login():
    """Initiate OAuth login (Stack or Google)"""
    try:
        provider = _resolve_provider()
        if provider is None:
            return redirect('/?error=provider_missing')

        state = secrets.token_urlsafe(32)
        session['oauth_state'] = state

        # Prefer configured frontend origin so cookies bind to learn.presh.ai
        base_origin = _get_frontend_origin() or request.host_url.rstrip('/')
        redirect_uri = base_origin + url_for('auth.callback')

        resp = provider.authorize_redirect(redirect_uri, state=state)
        # Also store state in a dedicated cookie as a fallback for state validation
        try:
            resp.set_cookie(
                'oauth_state',
                state,
                secure=True,
                httponly=True,
                samesite='None',
                path='/'
            )
        except Exception:
            pass
        return resp
    except Exception as e:
        try:
            from urllib.parse import quote
            # Include more detailed error information
            error_details = str(e)
            if hasattr(e, '__class__'):
                error_details = f"{e.__class__.__name__}: {error_details}"
            reason = quote(error_details, safe='')
        except Exception:
            reason = 'unknown'
        base_frontend = _get_frontend_origin() or '/'
        return redirect(f"{base_frontend}/?error=auth_init_failed&why={reason}")

@auth_bp.route('/diag', methods=['GET'])
def diag():
    """Minimal diagnostics without secrets"""
    has_stack = getattr(oauth, 'stack', None) is not None
    has_google = getattr(oauth, 'google', None) is not None
    frontend_origin = os.getenv('FRONTEND_ORIGIN')
    session_cookie_domain = os.getenv('SESSION_COOKIE_DOMAIN')
    db_url = os.getenv('DATABASE_URL', '')
    db_scheme = db_url.split(':', 1)[0] if db_url else ''
    stack_project_id = os.getenv('STACK_PROJECT_ID') or os.getenv('NEXT_PUBLIC_STACK_PROJECT_ID')
    stack_client_id = os.getenv('STACK_PUBLISHABLE_CLIENT_KEY') or os.getenv('NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY')
    stack_secret_present = bool(os.getenv('STACK_SECRET_SERVER_KEY'))
    stack_metadata_url = (
        os.getenv('STACK_OIDC_METADATA_URL')
        or (f'https://api.stack-auth.com/api/v1/projects/{stack_project_id}/.well-known/openid-configuration' if stack_project_id else None)
    )
    
    # Clean the values for display
    clean_frontend_origin = _get_frontend_origin()
    clean_session_domain = ''.join(session_cookie_domain.split()) if session_cookie_domain else None
    
    return jsonify({
        'providers': {
            'stack': has_stack,
            'google': has_google,
        },
        'auth_provider_env': AUTH_PROVIDER,
        'computed_redirect_uri': (clean_frontend_origin + url_for('auth.callback')) if clean_frontend_origin and request else None,
        'frontend_origin': clean_frontend_origin,
        'frontend_origin_raw': repr(frontend_origin),  # Show raw value for debugging
        'session_cookie_domain': clean_session_domain,
        'session_cookie_domain_raw': repr(session_cookie_domain),  # Show raw value for debugging
        'db_scheme': db_scheme,
        'stack': {
            'project_id_present': bool(stack_project_id),
            'client_id_present': bool(stack_client_id),
            'secret_present': stack_secret_present,
            'metadata_url': stack_metadata_url,
        },
    })

@auth_bp.route('/callback', methods=['GET'])
def callback():
    """Handle Google OAuth callback"""
    provider = getattr(oauth, 'stack', None) or oauth.google
    
    # Verify state parameter with session cookie fallback
    param_state = request.args.get('state')
    session_state = session.get('oauth_state')
    cookie_state = request.cookies.get('oauth_state')
    if param_state != (session_state or cookie_state):
        base_frontend = _get_frontend_origin() or '/'
        return redirect(f"{base_frontend}/?error=invalid_state")
    
    try:
        # Get access token
        token = provider.authorize_access_token()
        
        # Get user info from Google
        user_info = token.get('userinfo')
        if not user_info:
            user_info = provider.parse_id_token(token)
        
        # Check domain authorization
        user_email = user_info['email']
        if not is_authorized_domain(user_email):
            base_frontend = _get_frontend_origin() or '/'
            return redirect(f"{base_frontend}/?error=unauthorized_domain&domain={ALLOWED_DOMAIN}")
        
        # Check if user exists
        user = User.query.filter_by(email=user_email).first()
        
        if not user:
            # Create new user
            user = User(
                name=user_info.get('name', user_email),
                email=user_email,
                role='Marketing Strategist'
            )
            db.session.add(user)
            db.session.commit()
            
            # Log enrollment activity
            activity = LearningActivity(
                user_id=user.id,
                activity_type='enrollment',
                description='Joined AI Solution Designer Program via Google OAuth'
            )
            db.session.add(activity)
            db.session.commit()
        
        # Store user in session
        session['user_id'] = user.id
        session['user_email'] = user.email
        session['user_name'] = user.name
        
        # Redirect to dashboard on frontend
        base_frontend = _get_frontend_origin() or '/'
        return redirect(f"{base_frontend}/")
        
    except Exception as e:
        base_frontend = _get_frontend_origin() or '/'
        try:
            from urllib.parse import quote
            # Include more detailed error information
            error_details = str(e)
            if hasattr(e, '__class__'):
                error_details = f"{e.__class__.__name__}: {error_details}"
            why = quote(error_details, safe='')
        except Exception:
            why = 'unknown'
        return redirect(f"{base_frontend}/?error=auth_failed&why={why}")

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Log out the current user"""
    session.clear()
    return jsonify({'success': True})

@auth_bp.route('/user', methods=['GET'])
def get_current_user():
    """Get current authenticated user"""
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
        'progress': {
            'currentTrack': user.current_track,
            'currentModule': user.current_module,
            'completedModules': user.get_completed_modules(),
            'certifications': user.get_certifications()
        }
    })

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    user_id = session.get('user_id')
    return jsonify({
        'authenticated': user_id is not None,
        'user_id': user_id,
        'user_name': session.get('user_name'),
        'user_email': session.get('user_email')
    })

@auth_bp.route('/healthz', methods=['GET'])
def healthz():
    return jsonify({'ok': True})

# Middleware to require authentication
def require_auth():
    """Decorator to require authentication for routes"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({'error': 'Authentication required'}), 401
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator


import os
import sys
from dotenv import load_dotenv
# Proxy middleware to respect X-Forwarded-* headers when behind Vercel/Proxy
from werkzeug.middleware.proxy_fix import ProxyFix
# Add monorepo root to sys.path only when a sibling `src/` exists two levels up
two_levels_up = os.path.dirname(os.path.dirname(__file__))
if os.path.exists(os.path.join(two_levels_up, 'src')):
    sys.path.insert(0, two_levels_up)

from flask import Flask, send_from_directory, session
from flask_cors import CORS
# Support both monorepo root (`src.*`) and subdir project root (`models.*`, `routes.*`)
try:
    from src.models.training import db, User, ModuleProgress, CertificationAttempt, LearningActivity  # type: ignore
except ModuleNotFoundError:
    from models.training import db, User, ModuleProgress, CertificationAttempt, LearningActivity  # type: ignore

try:
    from src.routes.user import user_bp  # type: ignore
except ModuleNotFoundError:
    from routes.user import user_bp  # type: ignore

try:
    from src.routes.training import training_bp  # type: ignore
except ModuleNotFoundError:
    from routes.training import training_bp  # type: ignore

try:
    from src.routes.auth import auth_bp, init_oauth  # type: ignore
except ModuleNotFoundError:
    from routes.auth import auth_bp, init_oauth  # type: ignore

# Load local environment overrides for development
load_dotenv(os.path.join(os.path.dirname(__file__), '.env.local'))

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
# Trust proxy headers so url_for(..., _external=True) and request.scheme/host are correct
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'presh-ai-training-secret-key-2025')

# Secure session cookies for cross-site usage (frontend on different domain)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
# Explicit cookie domain for rewrites/proxy scenarios (e.g., learn.presh.ai)
session_cookie_domain = os.getenv('SESSION_COOKIE_DOMAIN', '')
if session_cookie_domain:
    # Remove all whitespace characters including newlines, tabs, etc.
    clean_domain = ''.join(session_cookie_domain.split())
    if clean_domain:
        app.config['SESSION_COOKIE_DOMAIN'] = clean_domain

# Enable CORS with credentials. Use explicit allowed origin for cookies.
frontend_origin = os.getenv('FRONTEND_ORIGIN', '')
# Remove all whitespace characters including newlines, tabs, etc.
frontend_origin = ''.join(frontend_origin.split())
if frontend_origin:
    CORS(app, supports_credentials=True, origins=[frontend_origin])
else:
    # Fallback without credentials if origin not configured
    CORS(app, supports_credentials=False, origins=['*'])

# Relax cookie settings for localhost development
if frontend_origin.startswith('http://localhost'):
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False

# Initialize OAuth
google = init_oauth(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(training_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/auth')

# Database configuration
# For production, use PostgreSQL or your preferred database
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:////tmp/app.db')
# Normalize common postgres URL prefixes for SQLAlchemy driver
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql+psycopg2://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    try:
        db.create_all()
    except Exception as e:
        # Defer DB initialization errors to runtime to avoid import-time crashes
        print(f"Database initialization skipped due to error: {e}")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


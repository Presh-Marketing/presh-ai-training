# Presh.ai Training Platform - Deployment Guide

## 🎯 Quick Deployment Checklist

### ✅ Pre-Deployment (5 minutes)
- [ ] Extract deployment package
- [ ] Install Python 3.11+ and Docker
- [ ] Create Google Cloud Console project
- [ ] Get OAuth credentials

### ✅ Google OAuth Setup (10 minutes)
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URIs

### ✅ Platform Deployment (5 minutes)
- [ ] Configure environment variables
- [ ] Run with Docker Compose
- [ ] Test authentication
- [ ] Verify domain restriction

---

## 🚀 Step-by-Step Deployment

### Step 1: Google Cloud Console Setup

1. **Create Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "Select a project" → "New Project"
   - Name: `Presh AI Training Platform`
   - Click "Create"

2. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "Internal" (restricts to your organization)
   - Fill required fields:
     - App name: `Presh AI Training Platform`
     - User support email: Your email
     - Developer contact: Your email

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: `Presh AI Training Auth`
   - Authorized redirect URIs:
     - `https://yourdomain.com/auth/callback`
     - `http://localhost:5000/auth/callback` (for testing)

5. **Save Credentials**
   - Copy the Client ID and Client Secret
   - You'll need these for the `.env` file

### Step 2: Platform Deployment

1. **Extract Package**
   ```bash
   # Extract the deployment package to your server
   cd presh-ai-deployment-package
   ```

2. **Configure Environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit with your credentials
   nano .env
   ```
   
   Add your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID=your-client-id-from-google
   GOOGLE_CLIENT_SECRET=your-client-secret-from-google
   SECRET_KEY=generate-a-secure-random-key
   ```

3. **Deploy with Docker**
   ```bash
   # Build and start the platform
   docker-compose up -d
   
   # Check if it's running
   docker-compose ps
   
   # View logs
   docker-compose logs -f
   ```

4. **Test the Platform**
   - Visit `http://your-server-ip:5000`
   - Click "Continue with Google"
   - Sign in with a @preshmarketingsolutions.com account
   - Verify you're redirected to the dashboard

### Step 3: Production Configuration

1. **Domain Setup**
   - Point your domain to the server IP
   - Update OAuth redirect URIs in Google Cloud Console
   - Configure SSL/HTTPS (recommended)

2. **Security Hardening**
   - Update CORS origins in `src/main.py`
   - Use strong SECRET_KEY
   - Configure firewall rules
   - Set up SSL certificates

3. **Database (Optional)**
   - For production, consider PostgreSQL
   - Update DATABASE_URL in .env
   - The provided Neon database is ready to use

---

## 🔧 Deployment Options

### Option 1: Docker Compose (Recommended)
**Best for:** Quick deployment, easy management
```bash
docker-compose up -d
```

### Option 2: Manual Python Setup
**Best for:** Custom configurations
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Option 3: Cloud Platforms

#### AWS EC2
1. Launch t3.medium instance
2. Install Docker and Docker Compose
3. Clone deployment package
4. Configure security groups (port 5000)
5. Run docker-compose up -d

#### Google Cloud Platform
1. Create Compute Engine instance
2. Install Docker
3. Deploy using Docker Compose
4. Configure firewall rules

#### DigitalOcean
1. Create Droplet (2GB RAM)
2. Use Docker one-click app
3. Deploy platform
4. Configure domain

---

## 🛡️ Security Checklist

### ✅ Authentication Security
- [ ] OAuth restricted to @preshmarketingsolutions.com
- [ ] Secure SECRET_KEY configured
- [ ] HTTPS enabled for production
- [ ] OAuth consent screen set to "Internal"

### ✅ Network Security
- [ ] Firewall configured (only necessary ports open)
- [ ] CORS origins restricted to your domain
- [ ] SSL certificates installed
- [ ] Database access restricted

### ✅ Application Security
- [ ] Environment variables secured
- [ ] Database backups configured
- [ ] Logs monitoring set up
- [ ] Regular updates scheduled

---

## 📊 Monitoring Setup

### Health Checks
```bash
# Check if application is running
curl http://localhost:5000/

# Check authentication endpoint
curl http://localhost:5000/auth/check-auth
```

### Log Monitoring
```bash
# Application logs
docker-compose logs -f web

# System logs
journalctl -u docker -f
```

### Database Monitoring
```bash
# SQLite size
ls -lh src/database/app.db

# PostgreSQL connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## 🚨 Troubleshooting

### Common Issues

**1. OAuth Error: "redirect_uri_mismatch"**
```
Solution: Update redirect URIs in Google Cloud Console
- Go to APIs & Services → Credentials
- Edit OAuth 2.0 client
- Add your domain: https://yourdomain.com/auth/callback
```

**2. "unauthorized_domain" Error**
```
Solution: User email doesn't end with @preshmarketingsolutions.com
- Only Presh Marketing Solutions employees can access
- Check email domain in Google account
```

**3. Application Won't Start**
```
Check logs: docker-compose logs web
Common causes:
- Missing environment variables
- Port already in use
- Database connection issues
```

**4. CORS Errors**
```
Solution: Update CORS origins in src/main.py
CORS(app, supports_credentials=True, origins=['https://yourdomain.com'])
```

### Getting Help

1. **Check Logs First**
   ```bash
   docker-compose logs -f
   ```

2. **Verify Configuration**
   ```bash
   cat .env  # Check environment variables
   docker-compose ps  # Check container status
   ```

3. **Test Components**
   ```bash
   # Test OAuth
   curl http://localhost:5000/auth/login
   
   # Test API
   curl http://localhost:5000/api/training/tracks
   ```

---

## 🎉 Success Checklist

### ✅ Deployment Complete When:
- [ ] Platform loads at your domain
- [ ] Google OAuth login works
- [ ] Only @preshmarketingsolutions.com users can access
- [ ] Dashboard shows training tracks
- [ ] User progress is tracked
- [ ] Certification tests are accessible

### ✅ Ready for Team Use When:
- [ ] SSL/HTTPS configured
- [ ] Domain properly configured
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Team members can successfully log in

---

**🚀 Your Presh.ai Training Platform is ready for deployment!**

Need help? Check the troubleshooting section or review the logs for specific error messages.


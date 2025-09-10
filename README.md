# Presh.ai AI Solution Designer Certification Platform

A comprehensive training platform for Presh Marketing Solutions' Account Services team, featuring interactive modules, progress tracking, and certification testing.

## 🚀 Features

- **4 Progressive Training Tracks** (10-12 months total)
- **19 Interactive Modules** with hands-on exercises
- **4 Professional Certifications** with comprehensive testing
- **Google OAuth Authentication** (restricted to @preshmarketingsolutions.com)
- **Real-time Progress Tracking** and analytics
- **Responsive Design** for desktop and mobile
- **Individual User Management** and activity logging

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend development)
- Google Cloud Console account
- Domain name (for production deployment)

## 🔧 Quick Start

### 1. Clone and Setup

```bash
# Extract the deployment package
cd presh-ai-deployment-package

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

Required environment variables:
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
- `SECRET_KEY`: Generate a secure random key

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Presh AI Training Platform"
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://yourdomain.com/auth/callback`
5. Configure OAuth consent screen (Internal for organization use)
6. Copy Client ID and Secret to your `.env` file

### 4. Run the Application

```bash
# Development mode
python src/main.py

# Production mode with Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 src.main:app
```

Visit `http://localhost:5000` to access the platform.

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Create .env file with your credentials
cp .env.example .env
# Edit .env with your values

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

### Using Docker Only

```bash
# Build image
docker build -t presh-ai-training .

# Run container
docker run -d \
  -p 5000:5000 \
  -e GOOGLE_CLIENT_ID=your-client-id \
  -e GOOGLE_CLIENT_SECRET=your-client-secret \
  -e SECRET_KEY=your-secret-key \
  --name presh-ai-training \
  presh-ai-training
```

## ☁️ Cloud Deployment

### AWS (EC2 + RDS)

1. **Launch EC2 instance** (t3.medium recommended)
2. **Set up RDS PostgreSQL** (optional, for production)
3. **Configure security groups** (port 5000, HTTPS)
4. **Deploy using Docker Compose**

### Google Cloud Platform

1. **Create Compute Engine instance**
2. **Set up Cloud SQL** (PostgreSQL)
3. **Configure firewall rules**
4. **Deploy using Docker**

### DigitalOcean

1. **Create Droplet** (2GB RAM minimum)
2. **Set up Managed Database** (optional)
3. **Configure domain and SSL**
4. **Deploy using Docker Compose**

## 🗄️ Database Configuration

### SQLite (Default)
- Suitable for small teams (< 10 users)
- No additional setup required
- Data stored in `src/database/app.db`

### PostgreSQL (Recommended for Production)
```bash
# Set DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@host:port/database
```

### Neon PostgreSQL (Pre-configured)
```bash
# Use the provided Neon database
DATABASE_URL=postgresql://neondb_owner:npg_5AoxD9tbCjWu@ep-frosty-credit-ad1n3nrr-pooler.c-2.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

## 🔒 Security Configuration

### Domain Restriction
The platform automatically restricts access to `@preshmarketingsolutions.com` email addresses.

### CORS Configuration
Update `CORS` origins in `src/main.py` with your domain:
```python
CORS(app, supports_credentials=True, origins=['https://yourdomain.com'])
```

### SSL/HTTPS
For production, ensure SSL is configured:
- Use a reverse proxy (nginx)
- Configure SSL certificates
- Update OAuth redirect URIs to use HTTPS

## 📊 Monitoring and Maintenance

### Logs
```bash
# Docker Compose logs
docker-compose logs -f web

# Application logs
tail -f logs/app.log
```

### Database Backup
```bash
# SQLite backup
cp src/database/app.db backups/app_$(date +%Y%m%d).db

# PostgreSQL backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## 🛠️ Development

### Frontend Development
```bash
cd frontend-source
npm install
npm run dev  # Development server on port 5173
npm run build  # Build for production
```

### Backend Development
```bash
# Install development dependencies
pip install -r requirements.txt

# Run with hot reload
export FLASK_ENV=development
python src/main.py
```

## 📁 Project Structure

```
presh-ai-deployment-package/
├── src/
│   ├── main.py              # Flask application
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── static/              # Built frontend files
│   └── database/            # SQLite database (if used)
├── frontend-source/         # React source code
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🔧 Troubleshooting

### Common Issues

**OAuth Error: "redirect_uri_mismatch"**
- Ensure redirect URI in Google Cloud Console matches your domain
- Use HTTPS for production deployments

**Database Connection Error**
- Check DATABASE_URL format
- Ensure database server is running
- Verify credentials and network access

**CORS Error**
- Update CORS origins in `src/main.py`
- Ensure frontend and backend domains match

**Port Already in Use**
- Change port in docker-compose.yml
- Kill existing processes: `sudo lsof -t -i:5000 | xargs kill`

### Support

For technical support or questions:
1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Test OAuth configuration in Google Cloud Console

## 📄 License

© 2025 Presh Marketing Solutions. All rights reserved.

---

**Ready to deploy your AI training platform!** 🚀


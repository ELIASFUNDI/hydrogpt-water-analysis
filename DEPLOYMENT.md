# HydroGPT Deployment Guide

## 🚀 Quick Start - Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- PostgreSQL database with PostGIS extension
- Anthropic API key
- Domain/hosting provider

### 1. Environment Setup
```bash
# Copy and configure environment variables
cp .env.production .env

# Edit .env with your actual values:
# - ANTHROPIC_API_KEY=sk-ant-api03-...
# - DATABASE_URL=postgresql://user:password@host:port/dbname
# - POSTGRES_PASSWORD=secure_password
```

### 2. Build and Deploy
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Access Application
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

---

## 🌐 Production Hosting Options

### Option 1: Railway (Recommended for Backend)

1. **Setup Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway**
   - Connect GitHub repository
   - Select `Dockerfile.backend`
   - Add environment variables:
     - `ANTHROPIC_API_KEY`
     - `DATABASE_URL`
     - `CORS_ORIGINS`

3. **Database Setup**
   - Add Railway PostgreSQL service
   - Enable PostGIS extension
   - Import your data

### Option 2: Vercel (Frontend Only)

1. **Configure Frontend**
   ```bash
   cd frontend/hydrogpt-frontend
   # Update .env.production with backend URL
   echo "REACT_APP_API_URL=https://your-backend.railway.app" > .env.production
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository
   - Set build command: `cd frontend/hydrogpt-frontend && npm run build`
   - Set output directory: `frontend/hydrogpt-frontend/build`

### Option 3: DigitalOcean/AWS (Full Control)

1. **Server Setup**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy Application**
   ```bash
   git clone your-repo
   cd hydrogpt
   cp .env.production .env
   # Edit .env with production values
   docker-compose up -d
   ```

3. **Setup Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api/ {
           proxy_pass http://localhost:8000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

---

## 📊 Database Requirements

### PostgreSQL with PostGIS
```sql
-- Required extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Required tables (import your existing data)
-- sublocations
-- sublocation_statistics  
-- waterpoints
```

### Data Import
Your existing database structure should include:
- `sublocations` table with `slname` and `geom` fields
- `sublocation_statistics` with accessibility scores
- `waterpoints` with capacity and location data

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
DATABASE_URL=postgresql://user:pass@host:port/dbname
CORS_ORIGINS=https://yourdomain.com,http://localhost:3000
PORT=8000
HOST=0.0.0.0
```

**Frontend (.env.production)**
```bash
REACT_APP_API_URL=https://your-backend-url.com
GENERATE_SOURCEMAP=false
```

### Security Considerations
- Use strong database passwords
- Restrict CORS origins to your domain
- Enable HTTPS in production
- Keep API keys secure
- Regular database backups

---

## 🔍 Monitoring & Maintenance

### Health Checks
- Backend: `GET /` returns API status
- Frontend: Standard HTTP health check
- Database: PostgreSQL connection test

### Logs
```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check resource usage
docker stats
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Ensure PostGIS extension is installed

2. **CORS Errors**
   - Update CORS_ORIGINS environment variable
   - Check frontend API URL configuration

3. **Build Failures**
   - Verify all dependencies in requirements.txt
   - Check Node.js version compatibility
   - Ensure sufficient disk space

4. **Memory Issues**
   - Monitor Docker container memory usage
   - Increase server resources if needed
   - Optimize database queries

### Performance Optimization
- Enable database connection pooling
- Use CDN for static assets
- Implement caching strategies
- Monitor API response times

---

## 📞 Support

For deployment issues:
1. Check logs first: `docker-compose logs`
2. Verify environment variables
3. Test database connectivity
4. Check API endpoint accessibility

---

**Ready to host HydroGPT!** 🌊
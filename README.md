# HenMo AI - Complete AI Development Platform

## 🚀 Quick Start

### Development
```bash
# Clone repository
git clone https://github.com/henmo-ai/henmo-ai.git
cd henmo-ai

# Start with Docker Compose
docker-compose up -d

# Access applications
# Hub: http://localhost:3000
# API: http://localhost:3001
```

### Production Deployment
```bash
# Copy environment variables
cp .env.prod.example .env.prod
# Edit .env.prod with your production values

# Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 📦 Services

- **Hub** (Port 3000): Next.js frontend application
- **API** (Port 3001): Node.js backend with AI services
- **PostgreSQL** (Port 5432): Primary database
- **Redis** (Port 6379): Caching and sessions
- **Nginx** (Port 80/443): Reverse proxy and SSL termination

## 🛠️ Development Commands

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild services
docker-compose build --no-cache

# Stop services
docker-compose down

# Database backup
./scripts/backup.sh
```

## 🔧 Environment Variables

See `.env.prod.example` for all required environment variables.

## 📊 Monitoring

- Health checks available at `/api/health`
- Metrics available at `/api/metrics`
- Logs centralized via Docker logging driver

## 🔒 Security

- SSL/TLS termination via Nginx
- JWT authentication
- Rate limiting
- CORS protection
- Security headers
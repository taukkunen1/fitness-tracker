# 🎯 Backend Quick Reference

## 🚀 Quick Commands

### Development
```bash
# Install dependencies
npm install

# Start backend (production mode)
npm start

# Start backend with auto-reload (development)
npm run dev

# Seed database with sample data
npm run seed

# Test all API endpoints
./test-api.sh
```

### Docker
```bash
# Development (with hot-reload and Mongo UI)
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all
docker-compose down

# Reset everything (including data)
docker-compose down -v
```

## 🔑 Default Credentials

After running `npm run seed`:

**Admin Account:**
- Username: `admin`
- Password: `Admin123!`
- Role: admin

**Demo Account:**
- Username: `demo`
- Password: `Demo123!`
- Role: user

## 📡 API Endpoints

### Base URL
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

### Health Check
```bash
GET /health
```

### Authentication (No Auth Required)
```bash
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
```

### Protected Endpoints (Requires JWT Token)
```bash
# User
GET  /api/auth/me              # Get current user
PUT  /api/auth/updateprofile   # Update profile
PUT  /api/auth/updatepassword  # Change password

# Workouts
GET    /api/workouts           # List all workouts
GET    /api/workouts/:id       # Get single workout
POST   /api/workouts           # Create workout
PUT    /api/workouts/:id       # Update workout
DELETE /api/workouts/:id       # Delete workout

# Meals
GET    /api/meals              # List all meals
GET    /api/meals/:id          # Get single meal
POST   /api/meals              # Create meal
PUT    /api/meals/:id          # Update meal
DELETE /api/meals/:id          # Delete meal

# Metrics
GET    /api/metrics            # List all metrics
POST   /api/metrics            # Create metric
DELETE /api/metrics/:id        # Delete metric

# Photos
GET    /api/photos             # List all photos
POST   /api/photos             # Upload photo (multipart)
DELETE /api/photos/:id         # Delete photo
```

## 🔐 Authentication

All protected endpoints require a Bearer token:

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Get token by logging in:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Admin123!"}'
```

## 📦 Environment Variables

Required variables in `.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fitness-tracker

# Security
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRE=24h

# Server
PORT=3000
NODE_ENV=production

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:8000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 🐳 Docker Services

### Production (`docker-compose.yml`)
- **mongodb**: MongoDB 7.0 database
- **api**: Node.js backend API
- **web**: Nginx frontend server
- **certbot**: SSL certificate management

### Development (`docker-compose.dev.yml`)
- **mongodb**: MongoDB 7.0 database
- **api**: Node.js backend (hot-reload)
- **mongo-express**: MongoDB web UI (http://localhost:8081)

## 📊 Database Collections

- **users**: User accounts and profiles
- **workouts**: Exercise sessions and tracking
- **meals**: Food intake and nutrition
- **metrics**: Body measurements over time
- **progressphotos**: Progress photos with metadata

## 🧪 Testing

### Automated Test
```bash
./test-api.sh
```

Tests all endpoints in sequence:
1. Health check
2. User registration
3. Login
4. Get user info
5. Create workout
6. Get workouts
7. Create meal
8. Get meals
9. Create metrics
10. Get metrics

### Manual Testing
See `API_TESTING.md` for detailed curl commands.

### MongoDB UI (Development)
Access Mongo Express at http://localhost:8081
- Username: `admin`
- Password: `admin`

## 🔍 Monitoring

### Check API Status
```bash
curl http://localhost:3000/health
```

### View Logs
```bash
# Docker
docker-compose logs -f api

# Direct
npm start  # logs to console
```

### Database Stats
```bash
# Connect to MongoDB
docker exec -it pilgrim-mongodb mongosh

# In MongoDB shell
use fitness-tracker
db.stats()
db.users.countDocuments()
db.workouts.countDocuments()
```

## ⚠️ Common Issues

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Check logs
docker-compose logs mongodb

# Verify connection string in .env
MONGODB_URI=mongodb://admin:password@mongodb:27017/fitness-tracker?authSource=admin
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000    # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or change PORT in .env
```

### JWT Token Invalid
- Check JWT_SECRET matches between requests
- Token may be expired (default 24h)
- Re-login to get new token

### CORS Error
- Add your frontend URL to CORS_ORIGINS in .env
- Restart backend after changing .env

## 📚 Documentation

- **Setup Guide**: [BACKEND_SETUP.md](BACKEND_SETUP.md)
- **API Testing**: [API_TESTING.md](API_TESTING.md)
- **Main README**: [README.md](README.md)
- **Security Policy**: [SECURITY.md](SECURITY.md)

## 🆘 Support

1. Check logs: `docker-compose logs -f`
2. Verify .env configuration
3. Review documentation
4. Check GitHub Issues: https://github.com/taukkunen1/fitness-tracker/issues

## 📝 Notes

- First registered user automatically becomes admin
- Failed login attempts lock account after 5 tries (15 min)
- Rate limit: 100 requests per 15 minutes per IP
- File uploads limited to 5MB by default
- JWT tokens expire after 24 hours by default
- All passwords are hashed with bcrypt (10 rounds)
- MongoDB connection uses connection pooling

---

**Created**: 2024-11-16  
**Version**: 1.0  
**Maintainer**: taukkunen1

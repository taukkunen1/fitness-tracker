# Backend Database Setup Guide

## Overview

This guide explains how to set up and use the backend database for the Pilgrim Fitness Tracker. The application now supports both:

1. **Frontend-only mode** (Original) - Uses IndexedDB in the browser
2. **Full-stack mode** (New) - Uses MongoDB backend with REST API

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │   Backend API   │      │    MongoDB      │
│   (Browser)     │─────▶│   (Node.js)     │─────▶│   (Database)    │
│   index.html    │      │   Express       │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Quick Start (Development)

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR Docker installed

### Option 1: Local Development (without Docker)

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   
   # Windows - Download from mongodb.com
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your configurations
   ```

4. **Start the Backend**
   ```bash
   npm start
   
   # Or for development with auto-reload
   npm run dev
   ```

5. **Open Frontend**
   ```bash
   # In a new terminal, serve the frontend
   python -m http.server 8000
   # Or
   npx http-server -p 8000
   ```

6. **Access the Application**
   - Frontend: http://localhost:8000
   - API: http://localhost:3000
   - API Health: http://localhost:3000/health

### Option 2: Docker (Recommended for Production)

1. **Copy environment file**
   ```bash
   cp .env.production .env
   # Edit .env with your production settings
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Check status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

4. **Access the Application**
   - Frontend: http://localhost
   - API: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update user profile
- `PUT /api/auth/updatepassword` - Update password

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get single workout
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Meals
- `GET /api/meals` - Get all meals
- `GET /api/meals/:id` - Get single meal
- `POST /api/meals` - Create meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Metrics
- `GET /api/metrics` - Get all metrics
- `POST /api/metrics` - Create metric entry
- `DELETE /api/metrics/:id` - Delete metric

### Progress Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload photo (multipart/form-data)
- `DELETE /api/photos/:id` - Delete photo

## Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (user|admin),
  isActive: Boolean,
  profile: {
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    goals: String
  },
  failedLoginAttempts: Number,
  accountLockedUntil: Date,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Workouts Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  type: String (strength|cardio|flexibility|sports|other),
  name: String,
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    duration: Number,
    notes: String
  }],
  duration: Number,
  caloriesBurned: Number,
  notes: String,
  template: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Meals Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  mealType: String (breakfast|lunch|dinner|snack),
  foods: [{
    name: String,
    quantity: Number,
    unit: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }],
  totalCalories: Number (calculated),
  totalProtein: Number (calculated),
  totalCarbs: Number (calculated),
  totalFat: Number (calculated),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Metrics Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  weight: Number,
  bodyFat: Number,
  muscleMass: Number,
  bmi: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ProgressPhotos Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  photoUrl: String,
  weight: Number,
  bodyFat: Number,
  notes: String,
  measurements: {
    chest: Number,
    waist: Number,
    hips: Number,
    arms: Number,
    thighs: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Mongoose schema validation
- **Account Locking**: After 5 failed login attempts
- **File Upload Validation**: Image types and size limits

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fitness-tracker

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRE=24h

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGINS=http://localhost:8000,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Migrating from IndexedDB to Backend

To migrate existing data from browser storage to the backend:

1. **Export data from IndexedDB** (use browser console):
   ```javascript
   // Export users
   const users = await dbGetAll('users');
   console.log(JSON.stringify(users));
   
   // Export other data similarly
   ```

2. **Import to backend** using API:
   ```javascript
   // Register users first
   for (const user of users) {
     await api.register({
       username: user.username,
       email: user.email,
       password: user.password, // Use a default or ask user to reset
       profile: user.profile
     });
   }
   
   // Then import workouts, meals, etc.
   ```

## Production Deployment

### Security Checklist

1. ✅ Change all default passwords
2. ✅ Set strong JWT_SECRET (min 64 characters)
3. ✅ Configure CORS for your domain only
4. ✅ Enable HTTPS
5. ✅ Set up MongoDB authentication
6. ✅ Configure firewall rules
7. ✅ Set up regular backups
8. ✅ Enable MongoDB replica set (for high availability)
9. ✅ Set up monitoring and logging
10. ✅ Configure rate limiting appropriately

### Docker Production Deployment

1. **Update .env.production** with production values
2. **Build and start**:
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **Set up SSL certificates**:
   ```bash
   # Generate certificates with certbot
   docker-compose run --rm certbot
   ```

4. **Set up automatic backups**:
   ```bash
   # Add to crontab
   0 2 * * * docker exec pilgrim-mongodb mongodump --out /backup
   ```

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `docker-compose ps mongodb`
- Check logs: `docker-compose logs api`
- Verify environment variables in `.env`

### Can't connect from frontend
- Check CORS settings in `.env`
- Verify API URL in frontend code
- Check browser console for errors

### Database connection fails
- Check MongoDB URI in `.env`
- Verify MongoDB is running: `docker-compose ps mongodb`
- Check MongoDB logs: `docker-compose logs mongodb`

### File uploads fail
- Check UPLOAD_PATH directory exists and is writable
- Verify MAX_FILE_SIZE is sufficient
- Check file type is allowed (jpg, png, webp)

## Monitoring

### Health Checks

```bash
# API health
curl http://localhost:3000/health

# MongoDB health
docker exec pilgrim-mongodb mongosh --eval "db.adminCommand('ping')"
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f mongodb
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

## Support

For issues or questions:
- GitHub Issues: https://github.com/taukkunen1/fitness-tracker/issues
- Documentation: See README.md

## Next Steps

1. ✅ Backend is set up and running
2. Update frontend to use API client (`js/api-client.js`)
3. Migrate existing data from IndexedDB
4. Test all functionality
5. Deploy to production
6. Set up monitoring and backups

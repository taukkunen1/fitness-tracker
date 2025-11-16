# Architecture Diagram - Pilgrim Fitness Tracker

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────┐     │
│   │         Frontend (HTML/JS/CSS)                      │     │
│   │  ┌────────────────────────────────────────┐         │     │
│   │  │  IndexedDB (Local Storage)             │         │     │
│   │  │  - 9 object stores                     │         │     │
│   │  │  - 100% offline capable                │         │     │
│   │  └────────────────────────────────────────┘         │     │
│   │                     OR                              │     │
│   │  ┌────────────────────────────────────────┐         │     │
│   │  │  API Client (js/api-client.js)        │         │     │
│   │  │  - JWT token management                │         │     │
│   │  │  - HTTP requests to backend            │         │     │
│   │  └────────────────────────────────────────┘         │     │
│   └─────────────────────────────────────────────────────┘     │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS/HTTP
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                       APPLICATION TIER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────┐     │
│   │         Node.js + Express Server                    │     │
│   │                                                      │     │
│   │  ┌────────────────────────────────────────┐         │     │
│   │  │  Middleware Layer                      │         │     │
│   │  │  - Helmet (Security Headers)           │         │     │
│   │  │  - CORS (Cross-Origin)                 │         │     │
│   │  │  - Rate Limiter (Brute Force)          │         │     │
│   │  │  - Body Parser (JSON)                  │         │     │
│   │  │  - JWT Authentication                  │         │     │
│   │  │  - Error Handler                       │         │     │
│   │  └────────────────────────────────────────┘         │     │
│   │                                                      │     │
│   │  ┌────────────────────────────────────────┐         │     │
│   │  │  Routes                                │         │     │
│   │  │  - /api/auth     (Authentication)      │         │     │
│   │  │  - /api/workouts (Exercise Tracking)   │         │     │
│   │  │  - /api/meals    (Nutrition)           │         │     │
│   │  │  - /api/metrics  (Body Measurements)   │         │     │
│   │  │  - /api/photos   (Progress Photos)     │         │     │
│   │  └────────────────────────────────────────┘         │     │
│   │                                                      │     │
│   │  ┌────────────────────────────────────────┐         │     │
│   │  │  Controllers/Business Logic            │         │     │
│   │  │  - User Management                     │         │     │
│   │  │  - CRUD Operations                     │         │     │
│   │  │  - Data Validation                     │         │     │
│   │  │  - File Upload Handling                │         │     │
│   │  └────────────────────────────────────────┘         │     │
│   │                                                      │     │
│   └──────────────────────┬───────────────────────────────┘     │
│                          │                                     │
└──────────────────────────┼─────────────────────────────────────┘
                           │
                           │ MongoDB Protocol
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                        DATABASE TIER                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   ┌────────────────────────────────────────────────────┐      │
│   │           MongoDB 7.0 (NoSQL)                      │      │
│   │                                                     │      │
│   │   Collections:                                     │      │
│   │   ┌─────────────────────────────────────┐          │      │
│   │   │  users                              │          │      │
│   │   │  - Authentication                   │          │      │
│   │   │  - Profiles                         │          │      │
│   │   │  - Roles & Permissions              │          │      │
│   │   └─────────────────────────────────────┘          │      │
│   │                                                     │      │
│   │   ┌─────────────────────────────────────┐          │      │
│   │   │  workouts                           │          │      │
│   │   │  - Exercise tracking                │          │      │
│   │   │  - Sets, reps, weights              │          │      │
│   │   └─────────────────────────────────────┘          │      │
│   │                                                     │      │
│   │   ┌─────────────────────────────────────┐          │      │
│   │   │  meals                              │          │      │
│   │   │  - Nutritional data                 │          │      │
│   │   │  - Macro calculations               │          │      │
│   │   └─────────────────────────────────────┘          │      │
│   │                                                     │      │
│   │   ┌─────────────────────────────────────┐          │      │
│   │   │  metrics                            │          │      │
│   │   │  - Body measurements                │          │      │
│   │   │  - Weight, body fat, BMI            │          │      │
│   │   └─────────────────────────────────────┘          │      │
│   │                                                     │      │
│   │   ┌─────────────────────────────────────┐          │      │
│   │   │  progressphotos                     │          │      │
│   │   │  - Photo metadata                   │          │      │
│   │   │  - File references                  │          │      │
│   │   └─────────────────────────────────────┘          │      │
│   └────────────────────────────────────────────────────┘      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Browser  │                │   API    │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ POST /api/auth/login      │                           │
     ├───────────────────────────>                           │
     │  {username, password}     │                           │
     │                           │                           │
     │                           │ Find user by username     │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │ User document             │
     │                           <──────────────────────────┤
     │                           │                           │
     │                           │ bcrypt.compare(password)  │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           <───────────┘               │
     │                           │                           │
     │                           │ jwt.sign(userId)          │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           <───────────┘               │
     │                           │                           │
     │ {success, token, user}    │                           │
     <───────────────────────────┤                           │
     │                           │                           │
     │ Store token in localStorage│                          │
     ├───────────┐               │                           │
     │           │               │                           │
     <───────────┘               │                           │
     │                           │                           │
```

### 2. Create Workout Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Browser  │                │   API    │                │ Database │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ POST /api/workouts        │                           │
     ├───────────────────────────>                           │
     │  Authorization: Bearer JWT │                          │
     │  {date, type, exercises..} │                          │
     │                           │                           │
     │                           │ Verify JWT token          │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           <───────────┘               │
     │                           │                           │
     │                           │ Extract userId from token │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           <───────────┘               │
     │                           │                           │
     │                           │ Validate workout data     │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           <───────────┘               │
     │                           │                           │
     │                           │ Save workout to DB        │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │ Created workout document  │
     │                           <──────────────────────────┤
     │                           │                           │
     │ {success, data: workout}  │                           │
     <───────────────────────────┤                           │
     │                           │                           │
```

### 3. File Upload Flow (Progress Photos)

```
┌──────────┐                ┌──────────┐                ┌────────┐    ┌──────────┐
│ Browser  │                │   API    │                │  Disk  │    │ Database │
└────┬─────┘                └────┬─────┘                └───┬────┘    └────┬─────┘
     │                           │                          │              │
     │ POST /api/photos          │                          │              │
     ├───────────────────────────>                          │              │
     │  multipart/form-data      │                          │              │
     │  - photo file             │                          │              │
     │  - metadata               │                          │              │
     │                           │                          │              │
     │                           │ multer: validate file    │              │
     │                           ├───────────┐              │              │
     │                           │           │              │              │
     │                           <───────────┘              │              │
     │                           │                          │              │
     │                           │ Save file to uploads/    │              │
     │                           ├─────────────────────────>│              │
     │                           │                          │              │
     │                           │ File saved successfully  │              │
     │                           <─────────────────────────┤              │
     │                           │                          │              │
     │                           │ Create photo document    │              │
     │                           │ with file path           │              │
     │                           ├─────────────────────────────────────────>
     │                           │                          │              │
     │                           │ Photo document created   │              │
     │                           <─────────────────────────────────────────┤
     │                           │                          │              │
     │ {success, data: photo}    │                          │              │
     <───────────────────────────┤                          │              │
     │                           │                          │              │
```

## Docker Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Docker Host                              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              app-network (bridge)                      │ │
│  │                                                        │ │
│  │  ┌──────────────┐   ┌──────────────┐   ┌───────────┐ │ │
│  │  │   mongodb    │   │     api      │   │    web    │ │ │
│  │  │  (mongo:7.0) │   │ (Node.js)    │   │  (nginx)  │ │ │
│  │  │              │   │              │   │           │ │ │
│  │  │ Port: 27017  │   │ Port: 3000   │   │ Port: 80  │ │ │
│  │  │              │◄──┤              │◄──┤ Port: 443 │ │ │
│  │  │ Volume:      │   │ Volume:      │   │           │ │ │
│  │  │ mongodb_data │   │ ./uploads    │   │           │ │ │
│  │  └──────────────┘   └──────────────┘   └───────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │        certbot (SSL certificates)                │ │ │
│  │  │        - ./certs:/etc/letsencrypt                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Development Only:
  ┌──────────────────────────┐
  │   mongo-express          │
  │   (MongoDB UI)           │
  │   Port: 8081             │
  │   user: admin/admin      │
  └──────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Security Layers                        │
└─────────────────────────────────────────────────────────┘

Layer 1: Network Security
  ┌─────────────────────────────────────┐
  │ - HTTPS/TLS encryption              │
  │ - Firewall rules                    │
  │ - Docker network isolation          │
  └─────────────────────────────────────┘

Layer 2: Application Security
  ┌─────────────────────────────────────┐
  │ - Helmet security headers           │
  │ - CORS configuration                │
  │ - Rate limiting (100 req/15min)     │
  │ - Input validation                  │
  │ - SQL injection prevention          │
  │ - XSS protection                    │
  └─────────────────────────────────────┘

Layer 3: Authentication & Authorization
  ┌─────────────────────────────────────┐
  │ - JWT token-based auth              │
  │ - bcrypt password hashing           │
  │ - Account locking (5 attempts)      │
  │ - Role-based access control         │
  │ - Session management                │
  └─────────────────────────────────────┘

Layer 4: Data Security
  ┌─────────────────────────────────────┐
  │ - MongoDB authentication            │
  │ - Encrypted connections             │
  │ - Data validation (Mongoose)        │
  │ - File upload restrictions          │
  └─────────────────────────────────────┘
```

## API Request Flow

```
HTTP Request
    │
    ├─> Express Middleware Chain
    │   │
    │   ├─> 1. Helmet (Security Headers)
    │   │
    │   ├─> 2. CORS (Cross-Origin Check)
    │   │
    │   ├─> 3. Rate Limiter (DDoS Protection)
    │   │
    │   ├─> 4. Body Parser (JSON)
    │   │
    │   └─> 5. JWT Auth Middleware (Protected Routes)
    │       │
    │       ├─> Token Valid?
    │       │   ├─> Yes: Continue
    │       │   └─> No: 401 Unauthorized
    │
    ├─> Route Handler
    │   │
    │   ├─> Controller Logic
    │   │   │
    │   │   ├─> Input Validation
    │   │   │
    │   │   ├─> Business Logic
    │   │   │
    │   │   └─> Database Query (Mongoose)
    │   │
    │   └─> Response
    │
    └─> Error Handler (if error occurs)
        │
        └─> Formatted Error Response
```

## Deployment Options

```
┌─────────────────────────────────────────────────────────┐
│                  Deployment Strategies                   │
└─────────────────────────────────────────────────────────┘

Option 1: Local Development
  ┌────────────────────┐
  │ npm start          │
  │ + MongoDB local    │
  └────────────────────┘

Option 2: Docker Development
  ┌────────────────────────────────┐
  │ docker-compose.dev.yml         │
  │ - Hot reload                   │
  │ - Mongo Express UI             │
  └────────────────────────────────┘

Option 3: Docker Production
  ┌────────────────────────────────┐
  │ docker-compose.yml             │
  │ - All services                 │
  │ - SSL/HTTPS                    │
  │ - Health checks                │
  └────────────────────────────────┘

Option 4: Cloud Platforms
  ┌────────────────────────────────┐
  │ - AWS (EC2, ECS, RDS)          │
  │ - Google Cloud (GKE, Cloud Run)│
  │ - Azure (Container Instances)  │
  │ - DigitalOcean (Droplets, App) │
  │ - Heroku                       │
  │ - Render                       │
  └────────────────────────────────┘
```

---

**Legend:**
- `──>` : Data flow direction
- `┌──┐` : Component/Service boundary
- `├──┤` : Process/Step
- `◄──` : Response direction

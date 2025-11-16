# API Testing Guide

This guide shows how to test all API endpoints using curl commands.

## Setup

1. Make sure the backend is running:
   ```bash
   npm start
   ```

2. Set environment variables for convenience:
   ```bash
   export API_URL="http://localhost:3000"
   export TOKEN=""
   ```

## Authentication Endpoints

### 1. Register New User

```bash
curl -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "profile": {
      "age": 28,
      "weight": 70,
      "height": 175,
      "gender": "male",
      "goals": "Build muscle and lose fat"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user",
    "profile": {...}
  }
}
```

**Save the token:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Login

```bash
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }'
```

### 3. Get Current User

```bash
curl -X GET $API_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update Profile

```bash
curl -X PUT $API_URL/api/auth/updateprofile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "profile": {
      "age": 29,
      "weight": 72,
      "height": 175,
      "gender": "male",
      "goals": "Increase strength"
    }
  }'
```

### 5. Update Password

```bash
curl -X PUT $API_URL/api/auth/updatepassword \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Test123!",
    "newPassword": "NewTest123!"
  }'
```

## Workout Endpoints

### 1. Get All Workouts

```bash
# All workouts
curl -X GET $API_URL/api/workouts \
  -H "Authorization: Bearer $TOKEN"

# With filters
curl -X GET "$API_URL/api/workouts?type=strength&startDate=2024-01-01" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Get Single Workout

```bash
curl -X GET $API_URL/api/workouts/{workoutId} \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Create Workout

```bash
curl -X POST $API_URL/api/workouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-11-16T10:00:00Z",
    "type": "strength",
    "name": "Full Body Workout",
    "exercises": [
      {
        "name": "Squat",
        "sets": 3,
        "reps": 10,
        "weight": 100,
        "notes": "Deep squats"
      },
      {
        "name": "Deadlift",
        "sets": 3,
        "reps": 8,
        "weight": 120,
        "notes": "Focus on form"
      }
    ],
    "duration": 45,
    "caloriesBurned": 400,
    "notes": "Great workout!"
  }'
```

### 4. Update Workout

```bash
curl -X PUT $API_URL/api/workouts/{workoutId} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Updated notes",
    "caloriesBurned": 450
  }'
```

### 5. Delete Workout

```bash
curl -X DELETE $API_URL/api/workouts/{workoutId} \
  -H "Authorization: Bearer $TOKEN"
```

## Meal Endpoints

### 1. Get All Meals

```bash
# All meals
curl -X GET $API_URL/api/meals \
  -H "Authorization: Bearer $TOKEN"

# With filters
curl -X GET "$API_URL/api/meals?mealType=breakfast&startDate=2024-11-01" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Create Meal

```bash
curl -X POST $API_URL/api/meals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-11-16T08:00:00Z",
    "mealType": "breakfast",
    "foods": [
      {
        "name": "Eggs",
        "quantity": 3,
        "unit": "pieces",
        "calories": 210,
        "protein": 18,
        "carbs": 2,
        "fat": 15
      },
      {
        "name": "Whole Wheat Toast",
        "quantity": 2,
        "unit": "slices",
        "calories": 160,
        "protein": 6,
        "carbs": 28,
        "fat": 2
      }
    ],
    "notes": "Post-workout breakfast"
  }'
```

### 3. Update Meal

```bash
curl -X PUT $API_URL/api/meals/{mealId} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Added protein shake"
  }'
```

### 4. Delete Meal

```bash
curl -X DELETE $API_URL/api/meals/{mealId} \
  -H "Authorization: Bearer $TOKEN"
```

## Metrics Endpoints

### 1. Get All Metrics

```bash
curl -X GET $API_URL/api/metrics \
  -H "Authorization: Bearer $TOKEN"

# With date filter
curl -X GET "$API_URL/api/metrics?startDate=2024-11-01&endDate=2024-11-16" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Create Metric Entry

```bash
curl -X POST $API_URL/api/metrics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-11-16T07:00:00Z",
    "weight": 75.5,
    "bodyFat": 15.2,
    "muscleMass": 64.3,
    "bmi": 24.6,
    "notes": "Morning weight"
  }'
```

### 3. Delete Metric

```bash
curl -X DELETE $API_URL/api/metrics/{metricId} \
  -H "Authorization: Bearer $TOKEN"
```

## Progress Photos Endpoints

### 1. Get All Photos

```bash
curl -X GET $API_URL/api/photos \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Upload Photo

```bash
curl -X POST $API_URL/api/photos \
  -H "Authorization: Bearer $TOKEN" \
  -F "photo=@/path/to/your/photo.jpg" \
  -F "date=2024-11-16T07:00:00Z" \
  -F "weight=75.5" \
  -F "bodyFat=15.2" \
  -F "notes=Front view" \
  -F 'measurements={"chest": 100, "waist": 80, "hips": 95}'
```

### 3. Delete Photo

```bash
curl -X DELETE $API_URL/api/photos/{photoId} \
  -H "Authorization: Bearer $TOKEN"
```

## Health Check

```bash
curl -X GET $API_URL/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-11-16T10:00:00.000Z"
}
```

## Testing Scripts

### Complete Test Flow

```bash
#!/bin/bash

API_URL="http://localhost:3000"

echo "=== Testing Fitness Tracker API ==="

# 1. Register
echo -e "\n1. Registering new user..."
RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apitest",
    "email": "apitest@example.com",
    "password": "Test123!",
    "profile": {"age": 25, "weight": 70, "height": 175, "gender": "male"}
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# 2. Get current user
echo -e "\n2. Getting current user..."
curl -s -X GET $API_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Create workout
echo -e "\n3. Creating workout..."
WORKOUT_RESPONSE=$(curl -s -X POST $API_URL/api/workouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "strength",
    "name": "Test Workout",
    "exercises": [{"name": "Push-up", "sets": 3, "reps": 10}],
    "duration": 30
  }')

WORKOUT_ID=$(echo $WORKOUT_RESPONSE | jq -r '.data._id')
echo "Created workout ID: $WORKOUT_ID"

# 4. Get workouts
echo -e "\n4. Getting all workouts..."
curl -s -X GET $API_URL/api/workouts \
  -H "Authorization: Bearer $TOKEN" | jq

# 5. Create meal
echo -e "\n5. Creating meal..."
curl -s -X POST $API_URL/api/meals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mealType": "breakfast",
    "foods": [{"name": "Oats", "quantity": 100, "calories": 380, "protein": 13}]
  }' | jq

# 6. Create metrics
echo -e "\n6. Creating metrics..."
curl -s -X POST $API_URL/api/metrics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 70,
    "bodyFat": 15,
    "muscleMass": 59.5
  }' | jq

echo -e "\n=== Test Complete ==="
```

Save this as `test-api.sh`, make it executable, and run:

```bash
chmod +x test-api.sh
./test-api.sh
```

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 423 Locked
```json
{
  "success": false,
  "message": "Account is temporarily locked due to too many failed login attempts"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

## Tips

1. **Save your token**: After login/register, save the token to a variable
2. **Use jq**: Install `jq` for pretty JSON output: `curl ... | jq`
3. **Check logs**: Monitor server logs for debugging
4. **Test in order**: Some tests depend on previous data
5. **Use Postman**: For a GUI alternative, import these as a collection

## Postman Collection

You can import these endpoints into Postman by creating requests with:
- Method, URL, Headers, Body as shown above
- Use Postman variables for `{{API_URL}}` and `{{TOKEN}}`

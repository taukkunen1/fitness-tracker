#!/bin/bash

# Simple API Test Script for Fitness Tracker
# This script tests all main API endpoints

API_URL="${API_URL:-http://localhost:3000}"
TEST_USER="apitest_$(date +%s)"
TEST_EMAIL="${TEST_USER}@example.com"
TEST_PASS="Test123!"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq not found. Install it for better output formatting${NC}"
    JQ_CMD="cat"
else
    JQ_CMD="jq"
fi

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Fitness Tracker API Test Suite          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo -e "${BLUE}API URL: $API_URL${NC}"
echo ""

# Test 1: Health Check
echo -e "${BLUE}[1/10] Testing health check...${NC}"
HEALTH_RESPONSE=$(curl -s $API_URL/health)
if echo "$HEALTH_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "$HEALTH_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 2: Register User
echo -e "\n${BLUE}[2/10] Registering test user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'$TEST_USER'",
    "email": "'$TEST_EMAIL'",
    "password": "'$TEST_PASS'",
    "profile": {
      "age": 25,
      "weight": 70,
      "height": 175,
      "gender": "male",
      "goals": "Test user goals"
    }
  }')

TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ User registered successfully${NC}"
    echo -e "  Username: $TEST_USER"
else
    echo -e "${RED}✗ Registration failed${NC}"
    echo "$REGISTER_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 3: Login
echo -e "\n${BLUE}[3/10] Testing login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'$TEST_USER'",
    "password": "'$TEST_PASS'"
  }')

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ Login successful${NC}"
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "$LOGIN_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 4: Get Current User
echo -e "\n${BLUE}[4/10] Getting current user...${NC}"
USER_RESPONSE=$(curl -s -X GET $API_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if echo "$USER_RESPONSE" | grep -q "$TEST_USER"; then
    echo -e "${GREEN}✓ User info retrieved${NC}"
else
    echo -e "${RED}✗ Failed to get user info${NC}"
    echo "$USER_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 5: Create Workout
echo -e "\n${BLUE}[5/10] Creating workout...${NC}"
WORKOUT_RESPONSE=$(curl -s -X POST $API_URL/api/workouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "strength",
    "name": "Test Workout",
    "exercises": [
      {
        "name": "Push-ups",
        "sets": 3,
        "reps": 10,
        "notes": "Test exercise"
      }
    ],
    "duration": 30,
    "caloriesBurned": 200,
    "notes": "Test workout"
  }')

WORKOUT_ID=$(echo "$WORKOUT_RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
if [ -n "$WORKOUT_ID" ]; then
    echo -e "${GREEN}✓ Workout created${NC}"
    echo -e "  Workout ID: $WORKOUT_ID"
else
    echo -e "${RED}✗ Failed to create workout${NC}"
    echo "$WORKOUT_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 6: Get Workouts
echo -e "\n${BLUE}[6/10] Getting workouts...${NC}"
WORKOUTS_RESPONSE=$(curl -s -X GET $API_URL/api/workouts \
  -H "Authorization: Bearer $TOKEN")

if echo "$WORKOUTS_RESPONSE" | grep -q "$WORKOUT_ID"; then
    echo -e "${GREEN}✓ Workouts retrieved${NC}"
else
    echo -e "${RED}✗ Failed to get workouts${NC}"
    echo "$WORKOUTS_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 7: Create Meal
echo -e "\n${BLUE}[7/10] Creating meal...${NC}"
MEAL_RESPONSE=$(curl -s -X POST $API_URL/api/meals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mealType": "breakfast",
    "foods": [
      {
        "name": "Oatmeal",
        "quantity": 100,
        "unit": "g",
        "calories": 380,
        "protein": 13,
        "carbs": 68,
        "fat": 7
      }
    ],
    "notes": "Test meal"
  }')

MEAL_ID=$(echo "$MEAL_RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
if [ -n "$MEAL_ID" ]; then
    echo -e "${GREEN}✓ Meal created${NC}"
    echo -e "  Meal ID: $MEAL_ID"
else
    echo -e "${RED}✗ Failed to create meal${NC}"
    echo "$MEAL_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 8: Get Meals
echo -e "\n${BLUE}[8/10] Getting meals...${NC}"
MEALS_RESPONSE=$(curl -s -X GET $API_URL/api/meals \
  -H "Authorization: Bearer $TOKEN")

if echo "$MEALS_RESPONSE" | grep -q "$MEAL_ID"; then
    echo -e "${GREEN}✓ Meals retrieved${NC}"
else
    echo -e "${RED}✗ Failed to get meals${NC}"
    echo "$MEALS_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 9: Create Metrics
echo -e "\n${BLUE}[9/10] Creating metrics...${NC}"
METRICS_RESPONSE=$(curl -s -X POST $API_URL/api/metrics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 70.5,
    "bodyFat": 15.2,
    "muscleMass": 59.8,
    "bmi": 23.0,
    "notes": "Test metrics"
  }')

METRIC_ID=$(echo "$METRICS_RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
if [ -n "$METRIC_ID" ]; then
    echo -e "${GREEN}✓ Metrics created${NC}"
    echo -e "  Metric ID: $METRIC_ID"
else
    echo -e "${RED}✗ Failed to create metrics${NC}"
    echo "$METRICS_RESPONSE" | $JQ_CMD
    exit 1
fi

# Test 10: Get Metrics
echo -e "\n${BLUE}[10/10] Getting metrics...${NC}"
METRICS_LIST_RESPONSE=$(curl -s -X GET $API_URL/api/metrics \
  -H "Authorization: Bearer $TOKEN")

if echo "$METRICS_LIST_RESPONSE" | grep -q "$METRIC_ID"; then
    echo -e "${GREEN}✓ Metrics retrieved${NC}"
else
    echo -e "${RED}✗ Failed to get metrics${NC}"
    echo "$METRICS_LIST_RESPONSE" | $JQ_CMD
    exit 1
fi

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   All Tests Passed Successfully! ✓        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Test Summary:${NC}"
echo -e "  ✓ Health check"
echo -e "  ✓ User registration"
echo -e "  ✓ User login"
echo -e "  ✓ Get user info"
echo -e "  ✓ Create workout"
echo -e "  ✓ Get workouts"
echo -e "  ✓ Create meal"
echo -e "  ✓ Get meals"
echo -e "  ✓ Create metrics"
echo -e "  ✓ Get metrics"
echo ""
echo -e "${YELLOW}Note: Test user '$TEST_USER' was created. Clean up manually if needed.${NC}"
echo ""

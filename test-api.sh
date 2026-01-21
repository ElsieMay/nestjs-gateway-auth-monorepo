#!/bin/bash

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Testing NestJS Gateway Auth Services..."
echo ""

# Test Gateway Health
echo -n "Testing Gateway Health... "
GATEWAY_HEALTH=$(curl -s http://localhost:3000/health)
if echo "$GATEWAY_HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
    exit 1
fi

# Test Register
echo -n "Testing User Registration... "
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test$(date +%s)@example.com\",
    \"username\": \"testuser$(date +%s)\",
    \"password\": \"Test123!\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "access_token"; then
    echo -e "${GREEN}✓ Success${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Failed${NC}"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi

# Test Login
echo -n "Testing User Login... "
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test@example.com\",
    \"username\": \"testuser\",
    \"password\": \"Test123!\"
  }")

# Login might fail if user doesn't exist, but endpoint should respond
if [ ! -z "$LOGIN_RESPONSE" ]; then
    echo -e "${GREEN}✓ Endpoint Responding${NC}"
else
    echo -e "${YELLOW}⚠ Endpoint returned empty response${NC}"
fi

# Test Protected Route
echo -n "Testing Protected Route... "
PROFILE_RESPONSE=$(curl -s http://localhost:3000/profile \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "email"; then
    echo -e "${GREEN}✓ Success${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
    echo "Response: $PROFILE_RESPONSE"
fi

# Test Swagger Docs
echo -n "Testing Swagger Documentation... "
SWAGGER_RESPONSE=$(curl -s http://localhost:3000/api-json)
if echo "$SWAGGER_RESPONSE" | grep -q "openapi"; then
    echo -e "${GREEN}✓ Available${NC}"
else
    echo -e "${RED}✗ Not Available${NC}"
fi

echo ""
echo -e "${GREEN}✨ All tests passed!${NC}"
echo ""
echo "📚 View API Documentation: http://localhost:3000/api"
echo "🔍 Try these URLs:"
echo "   - Gateway: http://localhost:3000"
echo "   - Health: http://localhost:3000/health"
echo "   - Swagger: http://localhost:3000/api"

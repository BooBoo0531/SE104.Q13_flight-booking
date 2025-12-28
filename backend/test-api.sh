#!/bin/bash

echo "🔐 Step 1: Login to get token..."
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flight.com","password":"flight123456"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed! Please check if backend is running and admin account exists."
  exit 1
fi

echo "✅ Token received!"
echo ""

echo "📋 Step 2: Get all flights..."
curl -s http://localhost:3000/flights \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool

echo ""
echo "✅ Test completed!"

#!/bin/bash

# Form Submissions API Testing Script
# This script tests all 15 API endpoints

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================="
echo "Form Submissions API Test Suite"
echo "=================================="
echo ""

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo "Endpoint: ${method} ${endpoint}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${BASE_URL}${endpoint}")
    elif [ "$method" = "POST" ] || [ "$method" = "PATCH" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X ${method} \
            -H "Content-Type: application/json" \
            -d "${data}" \
            "${BASE_URL}${endpoint}")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE "${BASE_URL}${endpoint}")
    fi
    
    http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE/d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success (HTTP ${http_code})${NC}"
        echo "Response: ${body}" | head -c 200
        echo "..."
    else
        echo -e "${RED}✗ Failed (HTTP ${http_code})${NC}"
        echo "Response: ${body}"
    fi
    echo ""
}

echo "=== CONTACT US API TESTS ==="
echo ""

# Test 1: Get all contact us records
test_endpoint "GET" "/api/admin/contact-us?page=1&limit=10" "" "Get all contact-us records (page 1)"

# Test 2: Search contact us
test_endpoint "GET" "/api/admin/contact-us?search=test&page=1&limit=10" "" "Search contact-us records"

# Test 3: Filter by status
test_endpoint "GET" "/api/admin/contact-us?status=1&page=1&limit=10" "" "Filter contact-us by status (New)"

# Test 4: Date range filter
test_endpoint "GET" "/api/admin/contact-us?startDate=2024-01-01&endDate=2024-12-31&page=1&limit=10" "" "Filter contact-us by date range"

# Test 5: Get single contact us record (assuming ID 1 exists)
test_endpoint "GET" "/api/admin/contact-us/1" "" "Get single contact-us record (ID: 1)"

# Test 6: Update contact us status
test_endpoint "PATCH" "/api/admin/contact-us/1" '{"status": 2, "notes": "Test update from script"}' "Update contact-us status"

# Test 7: Soft delete contact us
# test_endpoint "DELETE" "/api/admin/contact-us/1" "" "Soft delete contact-us record (ID: 1)"

# Test 8: Export contact us to CSV
echo -e "${YELLOW}Testing: Export contact-us to CSV${NC}"
echo "Endpoint: GET /api/admin/contact-us/export"
curl -s "${BASE_URL}/api/admin/contact-us/export" -o /tmp/contact-us-export.csv
if [ -f /tmp/contact-us-export.csv ]; then
    echo -e "${GREEN}✓ CSV exported successfully${NC}"
    echo "File size: $(wc -c < /tmp/contact-us-export.csv) bytes"
    echo "First 3 lines:"
    head -n 3 /tmp/contact-us-export.csv
else
    echo -e "${RED}✗ CSV export failed${NC}"
fi
echo ""

echo "=== FRANCHISE INQUIRIES API TESTS ==="
echo ""

# Test 9: Get all franchise inquiries
test_endpoint "GET" "/api/admin/franchise-inquiries?page=1&limit=10" "" "Get all franchise-inquiries (page 1)"

# Test 10: Search franchise inquiries
test_endpoint "GET" "/api/admin/franchise-inquiries?search=business&page=1&limit=10" "" "Search franchise-inquiries"

# Test 11: Filter by status
test_endpoint "GET" "/api/admin/franchise-inquiries?status=1&page=1&limit=10" "" "Filter franchise-inquiries by status"

# Test 12: Get single franchise inquiry
test_endpoint "GET" "/api/admin/franchise-inquiries/1" "" "Get single franchise-inquiry (ID: 1)"

# Test 13: Update franchise inquiry status
test_endpoint "PATCH" "/api/admin/franchise-inquiries/1" '{"status": 2, "notes": "Test update"}' "Update franchise-inquiry status"

# Test 14: Export franchise inquiries to CSV
echo -e "${YELLOW}Testing: Export franchise-inquiries to CSV${NC}"
echo "Endpoint: GET /api/admin/franchise-inquiries/export"
curl -s "${BASE_URL}/api/admin/franchise-inquiries/export" -o /tmp/franchise-export.csv
if [ -f /tmp/franchise-export.csv ]; then
    echo -e "${GREEN}✓ CSV exported successfully${NC}"
    echo "File size: $(wc -c < /tmp/franchise-export.csv) bytes"
else
    echo -e "${RED}✗ CSV export failed${NC}"
fi
echo ""

echo "=== LEAD GENERATION API TESTS ==="
echo ""

# Test 15: Get all lead generation
test_endpoint "GET" "/api/admin/lead-generation?page=1&limit=10" "" "Get all lead-generation (page 1)"

# Test 16: Search lead generation
test_endpoint "GET" "/api/admin/lead-generation?search=john&page=1&limit=10" "" "Search lead-generation"

# Test 17: Filter by status
test_endpoint "GET" "/api/admin/lead-generation?status=1&page=1&limit=10" "" "Filter lead-generation by status"

# Test 18: Get single lead generation
test_endpoint "GET" "/api/admin/lead-generation/1" "" "Get single lead-generation (ID: 1)"

# Test 19: Update lead generation status
test_endpoint "PATCH" "/api/admin/lead-generation/1" '{"status": 2, "notes": "Test update"}' "Update lead-generation status"

# Test 20: Export lead generation to CSV
echo -e "${YELLOW}Testing: Export lead-generation to CSV${NC}"
echo "Endpoint: GET /api/admin/lead-generation/export"
curl -s "${BASE_URL}/api/admin/lead-generation/export" -o /tmp/lead-generation-export.csv
if [ -f /tmp/lead-generation-export.csv ]; then
    echo -e "${GREEN}✓ CSV exported successfully${NC}"
    echo "File size: $(wc -c < /tmp/lead-generation-export.csv) bytes"
else
    echo -e "${RED}✗ CSV export failed${NC}"
fi
echo ""

echo "=================================="
echo "API Testing Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Check if all tests passed"
echo "2. Review any failed tests"
echo "3. Test UI in browser at /admin-portal/form-submission/"


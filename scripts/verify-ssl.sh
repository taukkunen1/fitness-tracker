#!/bin/bash

################################################################################
# SSL/HTTPS Verification Script for Pilgrim Fitness Tracker
# Tests SSL certificate, security headers, and HTTPS configuration
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="${1:-}"
TIMEOUT=10

# Usage
usage() {
    echo "Usage: $0 <domain>"
    echo "Example: $0 fitness-tracker.onrender.com"
    echo "Example: $0 taukkunen1.github.io/fitness-tracker"
    exit 1
}

# Check if domain provided
if [ -z "$DOMAIN" ]; then
    usage
fi

# Remove protocol if provided
DOMAIN=$(echo "$DOMAIN" | sed -e 's|^https://||' -e 's|^http://||')

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}SSL/HTTPS Verification for: ${YELLOW}$DOMAIN${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Test 1: Check if HTTPS is accessible
echo -e "${BLUE}[1/8] Testing HTTPS accessibility...${NC}"
if curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "https://$DOMAIN" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ HTTPS is accessible${NC}"
else
    echo -e "${RED}✗ HTTPS is not accessible${NC}"
    exit 1
fi
echo ""

# Test 2: Check HTTP to HTTPS redirect
echo -e "${BLUE}[2/8] Testing HTTP to HTTPS redirect...${NC}"
HTTP_RESPONSE=$(curl -s -I -L --max-time $TIMEOUT "http://$DOMAIN" | head -n 1)
if echo "$HTTP_RESPONSE" | grep -q "200\|301\|302"; then
    LOCATION=$(curl -s -I --max-time $TIMEOUT "http://$DOMAIN" | grep -i "location:" | head -n 1)
    if echo "$LOCATION" | grep -q "https://"; then
        echo -e "${GREEN}✓ HTTP redirects to HTTPS${NC}"
    else
        echo -e "${YELLOW}⚠ HTTP accessible but may not redirect to HTTPS${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Could not verify HTTP redirect${NC}"
fi
echo ""

# Test 3: Check SSL certificate validity
echo -e "${BLUE}[3/8] Checking SSL certificate...${NC}"
if command -v openssl &> /dev/null; then
    CERT_INFO=$(echo | openssl s_client -servername "$DOMAIN" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "")
    if [ -n "$CERT_INFO" ]; then
        echo -e "${GREEN}✓ SSL certificate is valid${NC}"
        echo "$CERT_INFO" | sed 's/^/  /'
    else
        echo -e "${YELLOW}⚠ Could not retrieve certificate info${NC}"
    fi
else
    echo -e "${YELLOW}⚠ OpenSSL not installed, skipping certificate check${NC}"
fi
echo ""

# Test 4: Check security headers
echo -e "${BLUE}[4/8] Checking security headers...${NC}"

check_header() {
    local header_name="$1"
    local header_value=$(curl -s -I --max-time $TIMEOUT "https://$DOMAIN" | grep -i "^$header_name:" | cut -d':' -f2- | tr -d '\r\n' | xargs)
    
    if [ -n "$header_value" ]; then
        echo -e "${GREEN}✓ $header_name: ${NC}$header_value"
        return 0
    else
        echo -e "${RED}✗ $header_name: ${NC}Not found"
        return 1
    fi
}

# Check critical security headers
HEADERS_OK=0

if check_header "Strict-Transport-Security"; then
    ((HEADERS_OK++))
fi

if check_header "X-Content-Type-Options"; then
    ((HEADERS_OK++))
fi

if check_header "X-Frame-Options"; then
    ((HEADERS_OK++))
fi

if check_header "Referrer-Policy"; then
    ((HEADERS_OK++))
fi

if check_header "Content-Security-Policy"; then
    ((HEADERS_OK++))
fi

echo ""
if [ $HEADERS_OK -ge 4 ]; then
    echo -e "${GREEN}✓ Security headers: $HEADERS_OK/5 present${NC}"
else
    echo -e "${YELLOW}⚠ Security headers: $HEADERS_OK/5 present (should be at least 4)${NC}"
fi
echo ""

# Test 5: Check TLS version
echo -e "${BLUE}[5/8] Checking TLS version...${NC}"
if command -v openssl &> /dev/null; then
    TLS_VERSION=$(echo | openssl s_client -servername "$DOMAIN" -connect "${DOMAIN}:443" 2>/dev/null | grep "Protocol" || echo "")
    if [ -n "$TLS_VERSION" ]; then
        echo -e "${GREEN}✓${NC} $TLS_VERSION"
        if echo "$TLS_VERSION" | grep -q "TLSv1.3\|TLSv1.2"; then
            echo -e "${GREEN}✓ Using secure TLS version${NC}"
        else
            echo -e "${RED}✗ Using outdated TLS version${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Could not determine TLS version${NC}"
    fi
else
    echo -e "${YELLOW}⚠ OpenSSL not installed, skipping TLS check${NC}"
fi
echo ""

# Test 6: Check mixed content
echo -e "${BLUE}[6/8] Checking for mixed content...${NC}"
MIXED_CONTENT=$(curl -s --max-time $TIMEOUT "https://$DOMAIN" | grep -i "http://" | grep -v "https://" | wc -l)
if [ "$MIXED_CONTENT" -eq 0 ]; then
    echo -e "${GREEN}✓ No mixed content detected${NC}"
else
    echo -e "${YELLOW}⚠ Possible mixed content detected ($MIXED_CONTENT instances)${NC}"
fi
echo ""

# Test 7: Check response time
echo -e "${BLUE}[7/8] Checking response time...${NC}"
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time $TIMEOUT "https://$DOMAIN")
if [ -n "$RESPONSE_TIME" ]; then
    echo -e "${GREEN}✓ Response time: ${RESPONSE_TIME}s${NC}"
    # Warn if slow
    if (( $(echo "$RESPONSE_TIME > 3" | bc -l 2>/dev/null || echo "0") )); then
        echo -e "${YELLOW}⚠ Response time is slow (>3s)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Could not measure response time${NC}"
fi
echo ""

# Test 8: SSL Labs recommendation
echo -e "${BLUE}[8/8] SSL Labs Test Recommendation${NC}"
echo -e "For comprehensive SSL/TLS analysis, test at:"
echo -e "${YELLOW}https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN${NC}"
echo ""

# Summary
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Calculate score
SCORE=0
MAX_SCORE=8

# HTTPS accessible
curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "https://$DOMAIN" | grep -q "200\|301\|302" && ((SCORE++))

# Security headers (at least 4/5)
[ $HEADERS_OK -ge 4 ] && ((SCORE++))

# SSL certificate valid (if openssl available)
if command -v openssl &> /dev/null; then
    echo | openssl s_client -servername "$DOMAIN" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null && ((SCORE++)) || true
else
    ((SCORE++))  # Give credit if can't test
fi

# TLS version (if openssl available)
if command -v openssl &> /dev/null; then
    TLS_CHECK=$(echo | openssl s_client -servername "$DOMAIN" -connect "${DOMAIN}:443" 2>/dev/null | grep "Protocol" || echo "")
    echo "$TLS_CHECK" | grep -q "TLSv1.3\|TLSv1.2" && ((SCORE++)) || true
else
    ((SCORE++))  # Give credit if can't test
fi

# No mixed content
[ "$MIXED_CONTENT" -eq 0 ] && ((SCORE++))

# Response time reasonable
if [ -n "$RESPONSE_TIME" ] && (( $(echo "$RESPONSE_TIME <= 3" | bc -l 2>/dev/null || echo "1") )); then
    ((SCORE++))
fi

# HTTP redirect (bonus if working)
if curl -s -I --max-time $TIMEOUT "http://$DOMAIN" | grep -i "location:" | grep -q "https://"; then
    ((SCORE++))
fi

# Calculate percentage
PERCENTAGE=$((SCORE * 100 / MAX_SCORE))

echo -e "Score: ${YELLOW}$SCORE/$MAX_SCORE${NC} (${PERCENTAGE}%)"
echo ""

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "${GREEN}✓ Excellent! HTTPS configuration is secure.${NC}"
    exit 0
elif [ $PERCENTAGE -ge 70 ]; then
    echo -e "${YELLOW}⚠ Good, but some improvements recommended.${NC}"
    exit 0
else
    echo -e "${RED}✗ HTTPS configuration needs improvement.${NC}"
    exit 1
fi

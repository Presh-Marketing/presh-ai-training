#!/bin/bash

echo "=== Google OAuth Debug Script for learn.presh.ai ==="
echo ""
echo "1. Checking Backend Configuration..."
echo "-----------------------------------"
curl -s https://api.learn.presh.ai/auth/diag | jq '.' || echo "Failed to reach backend"

echo ""
echo "2. Testing OAuth Login Redirect..."
echo "----------------------------------"
echo "Attempting to access: https://learn.presh.ai/auth/login"
response=$(curl -s -L -w "\n\nHTTP_CODE: %{http_code}\nREDIRECT_URL: %{redirect_url}\n" https://learn.presh.ai/auth/login -o /dev/null)
echo "$response"

echo ""
echo "3. Checking Frontend Proxy..."
echo "----------------------------"
curl -s -I https://learn.presh.ai/auth/login | grep -E "(HTTP|Location|Set-Cookie)" || echo "No response headers"

echo ""
echo "4. Direct Backend OAuth Test..."
echo "------------------------------"
curl -s -I https://api.learn.presh.ai/auth/login | grep -E "(HTTP|Location|Set-Cookie)" || echo "No response headers"

echo ""
echo "=== Troubleshooting Guide ==="
echo ""
echo "If you see 'invalid_client' in the redirect URL, this means:"
echo "1. Your GOOGLE_CLIENT_ID is incorrect or not recognized by Google"
echo "2. Your GOOGLE_CLIENT_SECRET doesn't match the Client ID"
echo "3. The OAuth app might be disabled in Google Cloud Console"
echo ""
echo "Next Steps:"
echo "1. Go to https://console.cloud.google.com/"
echo "2. Navigate to APIs & Services → Credentials"
echo "3. Verify your OAuth 2.0 Client ID exists and is enabled"
echo "4. Check that 'https://learn.presh.ai/auth/callback' is in Authorized redirect URIs"
echo ""

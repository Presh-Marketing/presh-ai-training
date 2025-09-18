#!/bin/bash

echo "=== Testing Google OAuth Client ID ===
"

CLIENT_ID="172704512827-84u3mtn7182je25g6tq5hq283jet7am3.apps.googleusercontent.com"
REDIRECT_URI="https://learn.presh.ai/auth/callback"

echo "Client ID: $CLIENT_ID"
echo "Redirect URI: $REDIRECT_URI"
echo ""

# Build the OAuth URL
AUTH_URL="https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid+email+profile&state=test123"

echo "Testing OAuth authorization URL..."
echo "URL: $AUTH_URL"
echo ""

# Test the URL and capture the redirect
echo "Checking Google's response..."
response=$(curl -s -I -L --max-redirs 1 "$AUTH_URL" 2>&1)

# Check if we got an error
if echo "$response" | grep -q "error=invalid_client"; then
    echo "❌ ERROR: Google returned 'invalid_client'"
    echo ""
    echo "This means the Client ID is not recognized by Google."
    echo ""
    echo "SOLUTION:"
    echo "1. This Client ID does not exist in Google Cloud Console"
    echo "2. You need to create a new OAuth 2.0 Client ID"
    echo ""
    echo "Steps to fix:"
    echo "1. Go to: https://console.cloud.google.com/"
    echo "2. Create a new project or select existing one"
    echo "3. Enable Google+ API"
    echo "4. Go to 'APIs & Services' > 'Credentials'"
    echo "5. Click '+ CREATE CREDENTIALS' > 'OAuth client ID'"
    echo "6. Choose 'Web application'"
    echo "7. Add Authorized redirect URI: https://learn.presh.ai/auth/callback"
    echo "8. Copy the new Client ID and Secret"
    echo "9. Update in Vercel:"
    echo "   - GOOGLE_CLIENT_ID = [new client id]"
    echo "   - GOOGLE_CLIENT_SECRET = [new secret]"
elif echo "$response" | grep -q "/signin/identifier"; then
    echo "✅ SUCCESS: Google accepted the Client ID!"
    echo ""
    echo "The Client ID is valid. The 'invalid_client' error is likely due to:"
    echo "1. Wrong Client Secret in your environment variables"
    echo "2. Client ID and Secret don't match (from different OAuth apps)"
    echo ""
    echo "To fix:"
    echo "1. Go to: https://console.cloud.google.com/"
    echo "2. Find this OAuth client: $CLIENT_ID"
    echo "3. Reset the secret or verify it matches what's in Vercel"
else
    echo "⚠️  Unexpected response from Google"
    echo ""
    echo "Response headers:"
    echo "$response" | head -20
fi

#!/bin/bash

echo "Verifying Authentication Configuration for learn.presh.ai"
echo "========================================================"
echo ""

# Check diagnostic endpoint
echo "1. Checking diagnostic endpoint..."
echo "   URL: https://learn.presh.ai/auth/diag"
echo ""

response=$(curl -s https://learn.presh.ai/auth/diag)

if [ $? -eq 0 ]; then
    echo "Response received:"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    echo ""
    
    # Check for newline characters in URLs
    if echo "$response" | grep -q '\\n'; then
        echo "⚠️  WARNING: Newline characters detected in configuration!"
        echo "   This needs to be fixed in Vercel environment variables."
    else
        echo "✅ No newline characters detected in configuration."
    fi
    
    # Check computed redirect URI
    redirect_uri=$(echo "$response" | jq -r '.computed_redirect_uri' 2>/dev/null)
    if [ "$redirect_uri" != "null" ] && [ -n "$redirect_uri" ]; then
        echo ""
        echo "2. Computed Redirect URI:"
        echo "   $redirect_uri"
        
        if [ "$redirect_uri" = "https://learn.presh.ai/auth/callback" ]; then
            echo "   ✅ Redirect URI is correctly formatted"
        else
            echo "   ⚠️  Redirect URI may have issues"
        fi
    fi
    
    # Check auth provider
    auth_provider=$(echo "$response" | jq -r '.auth_provider_env' 2>/dev/null)
    if [ "$auth_provider" != "null" ] && [ -n "$auth_provider" ]; then
        echo ""
        echo "3. Authentication Provider:"
        echo "   $auth_provider"
        
        # Check if provider is configured
        provider_status=$(echo "$response" | jq -r ".providers.$auth_provider" 2>/dev/null)
        if [ "$provider_status" = "true" ]; then
            echo "   ✅ Provider is configured"
        else
            echo "   ⚠️  Provider may not be properly configured"
        fi
    fi
    
else
    echo "❌ Failed to reach diagnostic endpoint"
    echo "   Please ensure the backend is deployed and running"
fi

echo ""
echo "========================================================"
echo "Next Steps:"
echo "1. If you see newline characters or malformed URLs, update your Vercel environment variables"
echo "2. Ensure OAuth credentials are properly set in Vercel"
echo "3. Test login at https://learn.presh.ai"
echo ""

# Google OAuth "invalid_client" Fix Guide

## Error: "Authentication failed: OAuthError: invalid_client: Unauthorized"

This error means Google is rejecting your OAuth credentials. Here's how to fix it:

## Step 1: Verify Your Google OAuth Credentials in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your **backend project** (`presh-ai-training-backend`)
3. Go to Settings → Environment Variables
4. Check these variables:
   - `GOOGLE_CLIENT_ID` - Should look like: `123456789012-abcdefghijklmnop.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET` - Should be a string like: `GOCSPX-1234567890abcdef`

**Common Issues:**
- Extra spaces or newlines in the values
- Quotation marks included in the values (remove them)
- Using the wrong project's credentials
- Client ID and Secret from different OAuth apps

## Step 2: Verify Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if needed)
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID

### Check OAuth Client Settings:
1. **Application Type**: Should be "Web application"
2. **Authorized JavaScript origins**: Add:
   ```
   https://learn.presh.ai
   https://api.learn.presh.ai
   ```
3. **Authorized redirect URIs**: Must include EXACTLY:
   ```
   https://learn.presh.ai/auth/callback
   ```
   (No trailing slash, no variations)

### Check OAuth Consent Screen:
1. Go to **APIs & Services** → **OAuth consent screen**
2. Ensure it's configured with:
   - App name
   - User support email
   - Developer contact email
   - Publishing status (can be "Testing" for now)

## Step 3: Quick Fix Checklist

Run these commands to verify your setup:

```bash
# Check current OAuth configuration
curl -s https://api.learn.presh.ai/auth/diag | jq '.providers'

# Test OAuth initialization (this will show detailed errors)
curl -s https://learn.presh.ai/auth/login -L -v 2>&1 | grep -E "(Location:|error)"
```

## Step 4: If Still Failing - Create New OAuth Credentials

Sometimes it's easier to start fresh:

1. In Google Cloud Console → Credentials
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Choose **Web application**
4. Name it: "Presh AI Training"
5. Add Authorized redirect URI: `https://learn.presh.ai/auth/callback`
6. Click **CREATE**
7. Copy the new Client ID and Client Secret

## Step 5: Update Vercel Environment Variables

1. Go to Vercel → Your backend project → Settings → Environment Variables
2. Update:
   - `GOOGLE_CLIENT_ID` = [Your new Client ID]
   - `GOOGLE_CLIENT_SECRET` = [Your new Client Secret]
3. **Important**: Make sure there are NO quotes, NO spaces, NO newlines
4. Click Save
5. Redeploy the backend (Vercel will do this automatically)

## Step 6: Test

Wait 2-3 minutes for deployment, then:
1. Visit https://learn.presh.ai
2. Click "Continue with Google"
3. You should be redirected to Google's login page

## Common Troubleshooting

### "The redirect URI in the request does not match"
- The URI must match EXACTLY what's in Google Console
- Check for trailing slashes, http vs https, etc.

### "Client authentication failed"
- Double-check Client ID and Secret are from the same OAuth app
- Ensure no extra characters when copying credentials

### Still getting "invalid_client"?
- Wait 5-10 minutes - Google sometimes needs time to propagate changes
- Try creating a completely new OAuth app in Google Console
- Ensure your Google Cloud project has the Google+ API enabled

## Debug Information

Your current configuration shows:
- Provider: Google OAuth (✓)
- Redirect URI: `https://learn.presh.ai/auth/callback` (✓)
- Frontend Origin: `https://learn.presh.ai` (✓)

The issue is specifically with the Google OAuth credentials themselves.

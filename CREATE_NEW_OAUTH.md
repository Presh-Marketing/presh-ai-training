# Creating New Google OAuth Credentials

If you can't find the existing OAuth client, create a new one:

## Step 1: Create OAuth 2.0 Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select a project or create a new one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **"+ CREATE CREDENTIALS"** → **OAuth client ID**

## Step 2: Configure OAuth Client

1. **Application type**: Web application
2. **Name**: Presh AI Training
3. **Authorized JavaScript origins**:
   ```
   https://learn.presh.ai
   https://api.learn.presh.ai
   ```
4. **Authorized redirect URIs** (MUST be exact):
   ```
   https://learn.presh.ai/auth/callback
   ```
5. Click **CREATE**

## Step 3: Copy Credentials

You'll see a popup with:
- **Client ID**: Something like `123456789012-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-1234567890abcdef`

Copy both values.

## Step 4: Update Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Open your **backend project** (`presh-ai-training-backend`)
3. Go to **Settings** → **Environment Variables**
4. Update:
   - `GOOGLE_CLIENT_ID` = [your new client id]
   - `GOOGLE_CLIENT_SECRET` = [your new client secret]
5. Save and wait for redeployment

## Step 5: Verify

After deployment (2-3 minutes), run:
```bash
curl -s https://api.learn.presh.ai/auth/diag | jq '.providers'
```

You should see:
```json
{
  "google": true,
  "stack": false
}
```

Then test login at https://learn.presh.ai

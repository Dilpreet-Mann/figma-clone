# Vercel Deployment Guide

## Required Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

### 1. Database Configuration
```
DATABASE_URL=postgresql://username:password@host:port/database
```
- **Required**: Yes
- **Example**: Your Neon PostgreSQL connection string
- **Where to get it**: Your database provider dashboard

### 2. Authentication Secret
```
AUTH_SECRET=your-secret-key-here
```
- **Required**: Yes (in production)
- **How to generate**: Run `openssl rand -base64 32` or use any secure random string generator
- **Note**: This is used by NextAuth.js for session encryption

### 3. Liveblocks Keys
```
LIVEBLOCKS_PUBLIC_KEY=pk_live_...
LIVEBLOCKS_SECRET_KEY=sk_live_...
```
- **Required**: Yes
- **Where to get it**: [Liveblocks Dashboard](https://liveblocks.io/dashboard)
- **Note**: Use your production keys, not development keys

### 4. Node Environment
```
NODE_ENV=production
```
- **Required**: Yes (automatically set by Vercel)
- **Note**: Vercel sets this automatically, but you can override if needed

## How to Add Environment Variables in Vercel

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
4. Click **Save**
5. **Redeploy** your project for changes to take effect

## Troubleshooting

### Error: "Invalid environment variables"

This error means one or more required environment variables are missing or invalid.

**Check:**
1. All variables listed above are set
2. `DATABASE_URL` is a valid PostgreSQL connection string
3. `AUTH_SECRET` is set and not empty
4. Liveblocks keys are correct and not empty
5. No typos in variable names (case-sensitive)

### Error: "DATABASE_URL must be a valid URL"

- Ensure your database connection string starts with `postgresql://`
- Check for special characters that need URL encoding
- Verify the connection string format: `postgresql://user:password@host:port/database`

### Error: "AUTH_SECRET is required in production"

- Generate a secure secret: `openssl rand -base64 32`
- Add it to Vercel environment variables
- Redeploy the project

## Quick Setup Checklist

- [ ] Database URL added to Vercel
- [ ] AUTH_SECRET generated and added
- [ ] LIVEBLOCKS_PUBLIC_KEY added
- [ ] LIVEBLOCKS_SECRET_KEY added
- [ ] All variables set for Production environment
- [ ] Project redeployed after adding variables

## Testing Locally

To test with the same environment variables locally, create a `.env.local` file:

```env
DATABASE_URL=your_database_url
AUTH_SECRET=your_auth_secret
LIVEBLOCKS_PUBLIC_KEY=your_public_key
LIVEBLOCKS_SECRET_KEY=your_secret_key
NODE_ENV=development
```

**Note**: Never commit `.env.local` to git (it's already in `.gitignore`)


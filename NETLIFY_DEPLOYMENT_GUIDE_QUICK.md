# Netlify Deployment Guide - Quick Steps

## Prerequisites

- Netlify account (create at https://netlify.com)
- Git repository pushed to GitHub/GitLab/Bitbucket
- Node.js 18+ installed

## Step 1: Fix the Build Issue

The build is failing because `@storybook/cli` is missing. Run this:

```bash
pnpm add -D @storybook/cli@^7.0.0
```

Or if using npm:

```bash
npm install --save-dev @storybook/cli@^7.0.0
```

## Step 2: Test Build Locally

```bash
npm run build
```

This should complete successfully before deploying.

## Step 3: Deploy to Netlify

### Option A: Using Netlify CLI (Recommended)

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Deploy:

```bash
netlify deploy --prod
```

### Option B: Connect GitHub Repository

1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `packages/demo-app/dist`
   - **Node version:** 18
6. Click "Deploy site"

### Option C: Manual Drag & Drop

1. Build locally:

```bash
npm run build
```

2. Go to https://app.netlify.com/drop
3. Drag and drop the `packages/demo-app/dist` folder
4. Your site will be deployed instantly

## Step 4: Configure Environment Variables (if needed)

In Netlify dashboard:

1. Go to Site settings → Build & deploy → Environment
2. Add any required environment variables
3. Redeploy

## Troubleshooting

**Build fails with "storybook not found":**

- Make sure you ran `pnpm add -D @storybook/cli@^7.0.0`
- Clear node_modules: `rm -rf node_modules && pnpm install`

**Build times out:**

- Increase timeout in netlify.toml: `functions = { node_bundler = "esbuild" }`

**Site shows 404:**

- Check that publish directory is correct: `packages/demo-app/dist`
- Verify redirects in netlify.toml are configured

## Current Configuration

Your `deployment/netlify.toml` is already configured with:

- Build command: `npm run build`
- Publish directory: `dist`
- Proper cache headers for assets
- SPA redirects (all routes → index.html)

## Next Steps

1. Fix the storybook CLI issue
2. Test build locally
3. Push to GitHub
4. Connect repository to Netlify
5. Monitor deployment in Netlify dashboard

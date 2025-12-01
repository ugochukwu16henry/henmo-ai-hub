# Vercel Deployment Configuration Guide

## Current Status
✅ Lockfile fixed (no aws-sdk v2)
✅ Submodule issue resolved
✅ vercel.json updated to use pnpm

## Required Vercel Dashboard Settings

### 1. Root Directory Configuration
**Critical:** You must set the Root Directory in Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Build & Development Settings**
3. Scroll to **Root Directory**
4. Set it to: `apps/hub/hub`
5. Click **Save**

This tells Vercel where your Next.js app is located in the monorepo.

### 2. Framework Settings
- **Framework Preset:** Next.js (should auto-detect)
- **Build Command:** `pnpm run build` (configured in vercel.json)
- **Output Directory:** `.next` (configured in vercel.json)
- **Install Command:** `cd ../.. && pnpm install --frozen-lockfile` (configured in vercel.json)

### 3. Package Manager
Vercel should auto-detect `pnpm` from the `pnpm-lock.yaml` file. If not:
- Ensure `pnpm-lock.yaml` exists in the repository root
- Vercel will use pnpm@10.x based on the lockfile version

### 4. Environment Variables
Make sure these are set in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Your API endpoint
- `NEXT_PUBLIC_APP_URL` - Your app URL
- Any other environment variables your app needs

## Troubleshooting

### Issue: "Cannot install with frozen-lockfile"
**Solution:** ✅ Fixed - The lockfile has been updated to remove aws-sdk v2

### Issue: "Failed to fetch git submodules"
**Solution:** ✅ Fixed - apps/web converted from submodule to regular directory

### Issue: Vercel building from old commit
**Solution:** 
1. Check that you're deploying from the `master` branch
2. Latest commit should be: `dc6b181e` or newer
3. If still building from old commit, manually trigger a new deployment

### Issue: Build fails with "module not found"
**Solution:**
- Ensure Root Directory is set to `apps/hub/hub`
- The install command runs from monorepo root to install all workspace dependencies

## Verification Checklist

- [ ] Root Directory set to `apps/hub/hub` in Vercel dashboard
- [ ] Latest commit on master branch includes lockfile fix
- [ ] vercel.json uses pnpm commands
- [ ] Environment variables configured
- [ ] Build command uses `pnpm run build`

## Current Commit Status
- Latest commit: `dc6b181e` - "fix: update vercel.json to use pnpm for monorepo builds"
- Lockfile: ✅ Correct (no aws-sdk v2)
- Package.json: ✅ Correct (only AWS SDK v3)
- Submodules: ✅ Fixed


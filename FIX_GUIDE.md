# 🔧 Quick Fix Guide - API Not Working

## What Was Wrong:
The Gemini API was returning a 404 error because:
1. The API endpoint might have been outdated (v1beta → v1)
2. The API key might not be set in Vercel environment variables

## What I Fixed:
✅ Updated API endpoint from `v1beta` to `v1`  
✅ Changed model from `gemini-1.5-flash` to `gemini-1.5-flash-latest`  
✅ Pushed the fix to GitHub

## What YOU Need to Do Now:

### Step 1: Check Vercel Environment Variable

The Vercel deployment page should be open in your browser. Look for the **Vercel tab**.

1. **In the Vercel dashboard**, click on your **eco-sort-ai** project
2. Go to **Settings** (in the top navigation)
3. Click **Environment Variables** (in the left sidebar)
4. **Check if `GEMINI_API_KEY` exists**:
   - ✅ If it exists: Skip to Step 2
   - ❌ If it doesn't exist: Click **Add** and enter:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: [Your actual Gemini API key]
     - **Environments**: Check all (Production, Preview, Development)
     - Click **Save**

### Step 2: Wait for Automatic Redeployment

Vercel automatically redeploys when you push to GitHub.

1. Go back to the **Deployments** tab in your Vercel project
2. You should see a new deployment building (it says "Building")
3. Wait 30-60 seconds until it says **"Ready"** with a green checkmark ✓
4. The new URL will be the same: https://eco-sort-lf43ppx42-manjarinks-projects.vercel.app/

### Step 3: Test Again

Once the deployment is complete:

1. Open your app: https://eco-sort-lf43ppx42-manjarinks-projects.vercel.app/
2. Click **"Upload Image"** or **"Use Camera"**
3. Select a waste item image (or take a photo)
4. Click **"Analyze Waste"**
5. You should see results! 🎉

---

## If It Still Doesn't Work:

Tell me which step failed:
- [ ] Did you add the GEMINI_API_KEY to Vercel?
- [ ] Did the new deployment finish building?
- [ ] Did you try uploading an image?
- [ ] What error message do you see (if any)?

---

## Quick Vercel Navigation:

**Your Vercel Dashboard**: https://vercel.com/manjarinks-projects/eco-sort-ai

1. Click **"Settings"** tab
2. Click **"Environment Variables"**  
3. Add `GEMINI_API_KEY` if missing
4. Check **"Deployments"** tab to see build status

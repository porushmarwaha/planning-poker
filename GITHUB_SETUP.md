# 🔗 GitHub Setup & Deployment Guide

## Step 1: Push Code to GitHub

### A. Initialize Git Repository

Open PowerShell in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Planning Poker app"
```

### B. Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create free account)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository settings:
   - **Name**: `planning-poker` (or any name you like)
   - **Visibility**: Public or Private (both work)
   - **DO NOT** initialize with README (you already have one)
4. Click **"Create repository"**

### C. Push to GitHub

GitHub will show you commands. Copy and run them:

```bash
# Add GitHub as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/planning-poker.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

**Your Git URL**: `https://github.com/YOUR_USERNAME/planning-poker`

---

## Step 2: Deploy Backend to Render.com

1. Go to [render.com](https://render.com) → **Sign up FREE**

2. Click **"New +"** → **"Web Service"**

3. **Connect GitHub**:
   - Click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select your `planning-poker` repository

4. **Configure Service**:
   ```
   Name: planning-poker-server
   Environment: Node
   Branch: main
   Build Command: npm install
   Start Command: node server/server.js
   Instance Type: Free
   ```

5. **Environment Variables** (click "Advanced" or go to "Environment" tab):
   - Add: `NODE_ENV` = `production`
   - Add: `CLIENT_URL` = `https://your-app.vercel.app` (update later)

6. Click **"Create Web Service"**

7. **Wait 2-3 minutes** for deployment

8. **Copy your backend URL**: `https://planning-poker-server-xxxx.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up FREE**

2. Click **"Add New"** → **"Project"**

3. **Import from GitHub**:
   - Click "Import Git Repository"
   - If first time: Click "Add GitHub Account" → Authorize Vercel
   - Select your `planning-poker` repository

4. **Configure Project**:
   ```
   Framework Preset: Vite (auto-detected)
   Root Directory: ./
   Build Command: npm run build (auto-detected)
   Output Directory: dist (auto-detected)
   Install Command: npm install (auto-detected)
   ```

5. **Environment Variables** (expand "Environment Variables"):
   - **Name**: `VITE_SOCKET_URL`
   - **Value**: `https://planning-poker-server-xxxx.onrender.com` (your Render URL from Step 2)
   - Click "Add"

6. Click **"Deploy"**

7. **Wait 1-2 minutes** for deployment

8. **Copy your frontend URL**: `https://planning-poker-xxxx.vercel.app` or `https://your-custom-name.vercel.app`

---

## Step 4: Update Backend CORS

1. Go back to **Render dashboard** → Your web service

2. Click **"Environment"** tab

3. **Add/Update Environment Variable**:
   - **Name**: `CLIENT_URL`
   - **Value**: `https://your-app.vercel.app` (your Vercel URL from Step 3)

4. Click **"Save Changes"**

5. Render will **automatically redeploy** (wait 1-2 minutes)

---

## ✅ You're Live!

Your Planning Poker app is now accessible at:
```
https://your-app.vercel.app
```

**Share this link with your team!** 🎉

---

## 🔄 Auto-Deploy on Push (Bonus)

Now whenever you push code to GitHub:
- **Vercel** will automatically rebuild and deploy your frontend
- **Render** will automatically rebuild and deploy your backend

To update your app:
```bash
git add .
git commit -m "Your update message"
git push
```

Both services will auto-deploy in 2-3 minutes!

---

## 🎯 Quick Checklist

- [ ] Create GitHub account
- [ ] Push code to GitHub repository
- [ ] Deploy backend to Render (get URL)
- [ ] Deploy frontend to Vercel (add VITE_SOCKET_URL)
- [ ] Update Render with CLIENT_URL
- [ ] Test the app!
- [ ] Share with team 🎊

---

## 📱 Custom Domain (Optional, FREE)

### On Vercel:
1. Go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `poker.yourcompany.com`)
3. Update DNS records at your domain registrar
4. Vercel provides FREE SSL certificate

### On Render:
1. Go to your service → **Settings** → **Custom Domain**
2. Add your custom domain (e.g., `api.yourcompany.com`)
3. Update DNS records
4. Render provides FREE SSL certificate

---

## 🆘 Troubleshooting

### "Repository not found" on Render/Vercel
- Make sure repository is not private, OR
- Grant access to Render/Vercel in GitHub settings

### "Build failed"
- Check build logs in Render/Vercel
- Make sure all dependencies are in package.json
- Try building locally first: `npm run build`

### "Can't connect to server"
- Check VITE_SOCKET_URL in Vercel environment variables
- Check CLIENT_URL in Render environment variables
- Make sure both URLs match exactly (with https://)

---

## 💡 Pro Tips

1. **First deployment takes longer** (~2-3 min). Subsequent deploys are faster.
2. **Render free tier sleeps** after 15 min. First request wakes it (~30 sec).
3. **Use GitHub** for version control and auto-deploy.
4. **Branch protection**: Deploy from `main` branch only.
5. **Monitor logs**: Both platforms have real-time logs.

---

## 🎉 You Did It!

- ✅ Code on GitHub (version controlled)
- ✅ Backend on Render (FREE, auto-deploy)
- ✅ Frontend on Vercel (FREE, auto-deploy)
- ✅ HTTPS everywhere (secure)
- ✅ Team can access via internet

**Total Cost: $0/month forever!** 🚀

Share and enjoy your Planning Poker app! 🃏✨

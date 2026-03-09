# 🚀 FREE Deployment Guide

Deploy your Planning Poker app **completely FREE** using these services:

## Architecture
- **Frontend (React)**: Vercel or Netlify (Free tier)
- **Backend (Socket.io)**: Render.com (Free tier)

---

## Step 1: Deploy Backend (Render.com - FREE)

### Option A: Using Render Dashboard

1. **Create account**: Go to [render.com](https://render.com) and sign up (FREE)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Deploy from Git URL"

3. **Configure Service**:
   ```
   Name: planning-poker-server
   Environment: Node
   Build Command: npm install
   Start Command: node server/server.js
   Instance Type: Free
   ```

4. **Add Environment Variable**:
   - Click "Environment" tab
   - Add: `CLIENT_URL` = `https://your-app-name.vercel.app` (you'll get this after frontend deployment)
   - Add: `NODE_ENV` = `production`

5. **Deploy**: Click "Create Web Service"

6. **Save your URL**: You'll get something like `https://planning-poker-server-xxxx.onrender.com`

### Option B: Using render.yaml (Already included)

1. Push code to GitHub
2. Connect Render to your repo
3. It will auto-detect `render.yaml`
4. Update `CLIENT_URL` in Render dashboard after frontend deployment

---

## Step 2: Deploy Frontend (Vercel - FREE)

### Using Vercel (Recommended)

1. **Create account**: Go to [vercel.com](https://vercel.com) and sign up (FREE)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Or drag and drop your project folder

3. **Configure Build**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variable**:
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_SOCKET_URL` = `https://planning-poker-server-xxxx.onrender.com` (your Render URL from Step 1)

5. **Deploy**: Click "Deploy"

6. **Your app URL**: You'll get `https://your-app-name.vercel.app`

7. **Update Backend CORS**:
   - Go back to Render dashboard
   - Update `CLIENT_URL` environment variable with your Vercel URL
   - Redeploy backend

### Alternative: Using Netlify

1. **Create account**: Go to [netlify.com](https://netlify.com) and sign up (FREE)

2. **Deploy**:
   - Drag and drop your project folder, OR
   - Connect GitHub repository

3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Environment Variables**:
   - Site settings → Environment variables
   - Add: `VITE_SOCKET_URL` = `https://planning-poker-server-xxxx.onrender.com`

5. **Update netlify.toml** (already included in project)

---

## Step 3: Test Your Deployment

1. Visit your frontend URL: `https://your-app-name.vercel.app`
2. Click "Start New Game"
3. Create a room
4. Open the room link in another browser/incognito window
5. Join and test voting!

---

## 🎯 Quick Deploy Checklist

- [ ] Deploy backend to Render.com (FREE)
- [ ] Get backend URL (e.g., `https://xxx.onrender.com`)
- [ ] Deploy frontend to Vercel (FREE)
- [ ] Add `VITE_SOCKET_URL` environment variable in Vercel
- [ ] Get frontend URL (e.g., `https://xxx.vercel.app`)
- [ ] Update `CLIENT_URL` in Render backend settings
- [ ] Redeploy backend on Render
- [ ] Test the app!

---

## 🔥 Free Tier Limits

### Render.com (Backend)
- ✅ 750 hours/month (enough for 24/7)
- ✅ Sleeps after 15 min of inactivity (wakes in ~30 seconds)
- ✅ 512 MB RAM
- ✅ No credit card required

### Vercel (Frontend)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited websites
- ✅ No sleep mode
- ✅ Custom domains (FREE)
- ✅ No credit card required

---

## 💡 Important Notes

1. **Render Free Tier Sleep**: 
   - Backend sleeps after 15 min of no activity
   - First request takes ~30 seconds to wake up
   - Keep-alive service (optional): Deploy a simple cron job to ping every 14 minutes

2. **Custom Domain** (Optional, FREE):
   - Buy domain from Namecheap (~$1-10/year)
   - Add to Vercel: Settings → Domains → Add
   - Configure DNS in Namecheap

3. **HTTPS Included**:
   - Both Render and Vercel provide FREE SSL certificates
   - Your app runs on HTTPS automatically!

---

## 🆘 Troubleshooting

### "Can't connect to server"
- Check `VITE_SOCKET_URL` in Vercel environment variables
- Make sure backend is deployed and running on Render
- Check browser console for CORS errors

### "CORS Error"
- Update `CLIENT_URL` in Render environment variables
- Must match your Vercel URL exactly (with https://)
- Redeploy backend after changing

### "Room not found"
- Render free tier restarts after 15 min inactivity
- Rooms are stored in-memory and will be lost on restart
- First request after sleep takes ~30 seconds

---

## 🎉 You're Live!

Share your Planning Poker app with your team:
```
https://your-app-name.vercel.app
```

**Total Cost: $0/month** 🎊

---

## 🔮 Optional Upgrades (Still FREE)

1. **GitHub Integration**: Auto-deploy on every push
2. **Analytics**: Vercel Analytics (FREE plan available)
3. **Custom Domain**: Add your own domain for professional look
4. **Monitoring**: Use Render's built-in metrics

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

Enjoy your FREE Planning Poker app! 🃏✨

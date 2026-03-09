# Keep Render.com free tier awake (optional)
# Deploy this to cron-job.org or similar service

# Ping URL every 14 minutes to prevent sleep
*/14 * * * * curl https://planning-poker-f92g.onrender.com/health

# BareProp App - Deployment Guide

This guide will help you deploy the BareProp App to GitHub and Render.

---

## 📋 Prerequisites

1. **GitHub Account** - For hosting the repository
2. **Render Account** - For cloud deployment
3. **Git** - Installed on your local machine

---

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub

First, you need to push the code to your GitHub repository:

```bash
# Navigate to your project directory
cd "bareprop app"

# Add remote repository (if not already added)
git remote add origin https://github.com/KALIM92786/bareprop-app.git

# Push to GitHub (you'll be prompted for credentials)
git push -u origin main
```

**Note**: If you encounter authentication issues, you may need to:
- Use a personal access token instead of password
- Or use SSH instead of HTTPS

### Step 2: Deploy Backend to Render

1. **Sign in to Render**
   - Go to [render.com](https://render.com)
   - Sign up or log in

2. **Create PostgreSQL Database**
   - Click "New +"
   - Select "PostgreSQL"
   - Configure:
     - Name: `bareprop-db`
     - Database: `bareprop`
     - User: `postgres`
     - Plan: Free
   - Click "Create Database"

3. **Create Backend Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `bareprop-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Runtime**: `Node 18` or higher

4. **Add Environment Variables**
   In the Environment section, add these variables:
   
   ```env
   PORT=5000
   # ... (See backend/RENDER_ENV_VARS.txt for full list)
   NODE_ENV=production
   DB_HOST=dpg-d5i7up56ubrc738ebjd0-a
   DB_PORT=5432
   DB_USER=barepropdbuser
   DB_PASSWORD=fqMLwJHJ2KwblPTM3YDIwKctJaYsVseT
   DB_DATABASE=barepropdb
   JWT_SECRET=<generate-a-strong-secret>
   FRONTEND_URL=https://bareprop-frontend.onrender.com
   RSTOCK_BASE_URL=https://api.stockstrader.com/api/v1
   STOCKSTRADER_TOKEN=2674108bf4576637e87b6f882b634176b9ccf6dbd65f322d7a1d1d0d899a74c8
   STOCKSTRADER_ACCOUNT_ID=93172055
   TEST_MODE=false
   TELEGRAM_BOT_TOKEN=<your-telegram-token>
   ```

   **Important**:
   - **ACTION REQUIRED**: You must MANUALLY add these variables in the Render Dashboard > Environment tab. Pushing the file to GitHub is NOT enough.
   - Get `DB_HOST` and `DB_PASSWORD` from your PostgreSQL service
   - Generate a strong `JWT_SECRET` (minimum 32 characters)
   - The `FRONTEND_URL` will be updated once frontend is deployed

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (2-3 minutes)
   - Copy the backend URL (e.g., `https://bareprop-backend.onrender.com`)

### Step 3: Deploy Frontend to Render

1. **Create Frontend Service**
   - Click "New +"
   - Select "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `bareprop-frontend`
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`

2. **Add Environment Variable**
   ```env
   VITE_API_URL=https://bareprop-backend.onrender.com
   ```

3. **Configure Rewrites (Important for React Router)**
   - Go to the **Redirects/Rewrites** tab in your Static Site dashboard
   - Click "Add Rule"
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
   - Click "Save Changes"

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Copy the frontend URL

### Step 4: Update Backend Configuration

1. Go back to your backend service on Render
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Deploy again (or it will auto-deploy on next push)

---

## 🔧 Using render.yaml (Alternative Method)

You can also deploy automatically using the `render.yaml` file:

1. Push your code to GitHub
2. Go to Render Dashboard
3. Click "New +"
4. Select "New Blueprint Instance"
5. Connect your GitHub repository
6. Select `render.yaml`
7. Review and create

This will create all services automatically.

---

## 📊 Database Setup

After deploying, you need to initialize the database schema:

### Option 1: Using Render Shell

1. Go to your PostgreSQL service on Render
2. Click "Connect" → "External Connection"
3. Use psql to connect and run schema:

```bash
PGPASSWORD=fqMLwJHJ2KwblPTM3YDIwKctJaYsVseT psql -h dpg-d5i7up56ubrc738ebjd0-a.oregon-postgres.render.com -U barepropdbuser barepropdb -f backend/db/schema.sql
```

### Option 2: Add Setup Script

Add this to your backend's `package.json`:

```json
"scripts": {
  "setup-db": "node scripts/setup_db.js"
}
```

Then run it after deployment via Render Shell.

---

## ✅ Verification

1. **Check Backend Health**
   ```bash
   curl https://bareprop-backend.onrender.com/health
   ```
   Should return: `{"status":"ok","timestamp":...,"uptime":...}`

2. **Check Frontend**
   - Open your frontend URL in a browser
   - Should see the BareProp dashboard

3. **Test Authentication**
   - Try to login (you'll need to create a user first)

---

## 🌐 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port (usually 5432) | Yes |
| `DB_USER` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_DATABASE` | Database name | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `RSTOCK_BASE_URL` | StocksTrader API URL | Yes |
| `STOCKSTRADER_TOKEN` | Your API token | Yes |
| `STOCKSTRADER_ACCOUNT_ID` | Your account ID | Yes |
| `TEST_MODE` | Enable test mode | Yes |
| `TELEGRAM_BOT_TOKEN` | Optional Telegram bot | No |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: Backend can't connect to database

**Solutions**:
1. Check database is running on Render
2. Verify DB_HOST and DB_PASSWORD are correct
3. **Fix Localhost Error**: If logs show `ECONNREFUSED 127.0.0.1:5432`, it means `DB_HOST` is MISSING in the Render Dashboard. The app is defaulting to localhost. Go to the Environment tab and add the variables.
4. Ensure Render services are in the same region
5. Check Render logs for error messages

### CORS Issues

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify FRONTEND_URL matches your actual frontend URL
2. Check backend CORS configuration
3. Ensure backend is running and accessible

### Build Failures

**Problem**: Frontend or backend build fails

**Solutions**:
1. Check Render build logs
2. Ensure all dependencies are in package.json
3. Check Node.js version compatibility
4. Verify build commands are correct
5. **Fix Import Errors**: If you see `"default" is not exported`, check that you are using `export default` in your component or use named imports `{ Component }`.

### WebSocket Issues

**Problem**: Real-time updates not working

**Solutions**:
1. Ensure both services are deployed
2. Check WebSocket URL configuration
3. Verify firewall settings
4. Check browser console for errors

---

## 📝 Post-Deployment Checklist

- [ ] Backend service is running
- [ ] Frontend service is running
- [ ] Database is configured and accessible
- [ ] Environment variables are set correctly
- [ ] Database schema is initialized
- [ ] Health check endpoint works
- [ ] Frontend can connect to backend
- [ ] WebSocket connections work
- [ ] Authentication works
- [ ] Trading data syncs correctly
- [ ] Logs are being captured
- [ ] Monitor error rates

---

## 🔒 Security Best Practices for Production

1. **Never commit `.env` files** to GitHub
2. **Use strong, unique passwords** for database
3. **Generate secure JWT_SECRET** (use a password manager)
4. **Rotate API tokens** regularly
5. **Enable HTTPS** (Render does this automatically)
6. **Set up monitoring** for errors and performance
7. **Implement rate limiting** on API endpoints
8. **Regularly update dependencies**
9. **Backup database** regularly
10. **Review logs** for suspicious activity

---

## 📈 Monitoring and Logs

### View Logs on Render

1. Go to your service on Render
2. Click "Logs" tab
3. Filter by: All, Errors, or Warnings
4. Download logs for analysis

### Health Check

Monitor your services using:
```bash
# Backend health
curl https://bareprop-backend.onrender.com/health

# Frontend access
curl -I https://bareprop-frontend.onrender.com
```

---

## 🔄 Updates and Redeployment

To update your application:

1. Make changes locally
2. Commit changes:
   ```bash
   git add .
   git commit -m "Update message"
   git push
   ```
3. Render will automatically detect changes and redeploy

---

## 💰 Cost Estimation

**Render Free Tier**:
- PostgreSQL: $0/month (up to 90 days)
- Web Services: $0/month (750 hours/month)
- Static Sites: $0/month (100GB bandwidth)

**Paid Tier** (if needed):
- PostgreSQL: Starting at $7/month
- Web Services: Starting at $7/month
- Static Sites: Free

---

## 📞 Support

If you encounter issues:

1. Check Render's [documentation](https://render.com/docs)
2. Review Render logs
3. Check GitHub issues in your repository
4. Contact Render support

---

## 🎉 Success!

Your BareProp App is now deployed and running on Render! You can access:

- **Frontend**: https://bareprop-frontend.onrender.com
- **Backend API**: https://bareprop-backend.onrender.com
- **Database**: Managed by Render

Next steps:
- Set up custom domain (optional)
- Configure monitoring and alerts
- Add team members to Render
- Set up CI/CD pipeline (optional)

---

**Last Updated**: January 11, 2026
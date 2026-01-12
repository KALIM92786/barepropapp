# Deployment Checklist - BareProp App

Use this checklist to complete the deployment process.

---

## ✅ Completed Automatically

- [x] Updated environment variables with your StocksTrader credentials
- [x] Updated backend dependencies (axios, node-telegram-bot-api)
- [x] Fixed server entry point configuration
- [x] Installed all dependencies
- [x] Initialized Git repository
- [x] Created comprehensive .gitignore
- [x] Committed all changes
- [x] Created render.yaml configuration
- [x] Created deployment guide (DEPLOYMENT_GUIDE.md)
- [x] Created quick start guide (QUICK_START.md)
- [x] Created comprehensive README.md

---

## 📋 Manual Steps Required

### Step 1: Push to GitHub

**IMPORTANT**: You must do this on your local machine with your GitHub credentials.

```bash
# Navigate to project directory
cd "bareprop app"

# Push to GitHub
git push -u origin main
```

**If you get authentication errors**:
1. Generate a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens
   - Generate new token with `repo` scope
2. Use the token as your password when prompted
3. Or use SSH instead of HTTPS

### Step 2: Deploy to Render

#### Option A: Manual Deployment (Recommended)

1. **Create Render Account**
   - Go to [render.com](https://render.com) and sign up

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `barepropdb`
   - Database: `barepropdb`
   - User: `barepropdbuser`
   - Click "Create"

3. **Create Backend Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repo: `KALIM92786/bareprop-app`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Runtime: Node 18

4. **Add Environment Variables** (in Backend service):
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=dpg-d5i7up56ubrc738ebjd0-a
   DB_PORT=5432
   DB_USER=barepropdbuser
   DB_PASSWORD=fqMLwJHJ2KwblPTM3YDIwKctJaYsVseT
   DB_DATABASE=barepropdb
   JWT_SECRET=bareprop_secure_jwt_secret_key_2024_production
   FRONTEND_URL=https://bareprop-frontend.onrender.com
   RSTOCK_BASE_URL=https://api.stockstrader.com/api/v1
   STOCKSTRADER_TOKEN=2674108bf4576637e87b6f882b634176b9ccf6dbd65f322d7a1d1d0d899a74c8
   STOCKSTRADER_ACCOUNT_ID=93172055
   TEST_MODE=false
   TELEGRAM_BOT_TOKEN=<optional>
   ```

5. **Create Frontend Service**
   - Click "New +" → "Static Site"
   - Connect GitHub repo: `KALIM92786/bareprop-app`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variable: `VITE_API_URL=https://bareprop-backend.onrender.com`
   - **Add Rewrite Rule**: Source `/*`, Destination `/index.html`, Action `Rewrite`

6. **Update Backend FRONTEND_URL**
   - After frontend is deployed, get the URL
   - Go back to backend service
   - Update FRONTEND_URL with actual frontend URL
   - Redeploy

#### Option B: Using render.yaml (Automatic)

1. Push code to GitHub
2. Go to Render Dashboard
3. Click "New +" → "New Blueprint Instance"
4. Connect GitHub repo
5. Select `render.yaml` file
6. Review and create

**Note**: You'll still need to add environment variables manually after deployment.

### Step 3: Initialize Database

After services are deployed:

```bash
# Connect to Render PostgreSQL
PGPASSWORD=fqMLwJHJ2KwblPTM3YDIwKctJaYsVseT psql -h dpg-d5i7up56ubrc738ebjd0-a.oregon-postgres.render.com -U barepropdbuser barepropdb -f backend/db/schema.sql
```

Or use Render Shell:
1. Go to PostgreSQL service on Render
2. Click "Connect" → "External Connection"
3. Copy connection details
4. Run schema import

### Step 4: Create Admin User

Create a user to login:

```sql
-- Generate password hash (use Node.js)
node -e "console.log(require('bcryptjs').hashSync('YourPassword123', 10))"

-- Insert into database (replace hash)
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2a$10$your_hashed_password_here', 'admin');
```

### Step 5: Add Trading Account

Add your StocksTrader account:

```sql
INSERT INTO accounts (user_id, external_account_id, name, api_token, is_active)
VALUES (1, '93172055', 'Main Account', '2674108bf4576637e87b6f882b634176b9ccf6dbd65f322d7a1d1d0d899a74c8', true);
```

---

## 🔍 Verification Steps

After deployment:

- [ ] Backend health check works: `https://bareprop-backend.onrender.com/health`
- [ ] Frontend loads: `https://bareprop-frontend.onrender.com`
- [ ] Can login to application
- [ ] Database tables are created
- [ ] WebSocket connection works
- [ ] Trading data syncs (check logs)
- [ ] No errors in Render logs

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `QUICK_START.md` | Local development guide |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment instructions |
| `render.yaml` | Render configuration file |
| `.env.example` | Environment variables template |
| `backend/.env` | Your local environment variables |
| `PROJECT_ANALYSIS_AND_UPDATES.md` | Analysis report |

---

## 🔐 Security Reminders

Before going to production:

- [ ] ⚠️ **ROTATE API TOKEN**: The StocksTrader token in .env may be exposed
- [ ] ⚠️ **CHANGE DATABASE PASSWORD**: Don't use default credentials
- [ ] ⚠️ **USE STRONG JWT_SECRET**: The current one is just a placeholder
- [ ] ⚠️ **ENABLE HTTPS**: Render does this automatically
- [ ] ⚠️ **SET UP MONITORING**: Watch for errors and unusual activity
- [ ] ⚠️ **BACKUP DATABASE**: Regular backups are essential
- [ ] ⚠️ **REVIEW LOGS**: Check for security issues regularly

---

## 🚨 Common Issues

### GitHub Push Fails

**Error**: `could not read Username`
**Solution**: Use Personal Access Token or SSH

### Database Connection Fails

**Error**: `connection refused`
**Solution**: 
- Check database is running
- **Verify Environment Variables**: Ensure `DB_HOST` is set to the internal address (e.g., `dpg-d5i7up56ubrc738ebjd0-a`) in Render Dashboard.
- **Fix Localhost Error**: The error `ECONNREFUSED 127.0.0.1:5432` confirms that `DB_HOST` is MISSING in Render Dashboard. You must manually add the environment variables.
- Ensure services are in same region

### Frontend Can't Connect to Backend

**Error**: CORS errors
**Solution**: 
- Verify FRONTEND_URL matches actual frontend URL
- Check backend CORS configuration

### Build Fails (Import Error)

**Error**: `"default" is not exported`
**Solution**: Add `export default ComponentName;` to the end of your component file.

### WebSocket Not Working

**Error**: No real-time updates
**Solution**:
- Verify both services are running
- Check WebSocket URL configuration
- Review browser console for errors

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **GitHub Docs**: https://docs.github.com
- **Project README**: `README.md` in project root
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`

---

## 🎉 Success Indicators

You'll know deployment is successful when:

1. ✅ All Render services show "Live" status
2. ✅ Frontend loads without errors
3. ✅ Can login with created user
4. ✅ Dashboard shows connection status
5. ✅ Trading data appears in dashboard
6. ✅ No errors in Render logs
7. ✅ Health check endpoint returns OK

---

## 📊 Cost Summary

**Free Tier** (Recommended for testing):
- PostgreSQL: Free (90 days)
- Backend: Free (750 hours/month)
- Frontend: Free (100GB bandwidth)

**Paid Tier** (Production):
- PostgreSQL: $7/month minimum
- Backend: $7/month minimum
- Frontend: Free
- Total: ~$14/month minimum

---

## 🔄 Updates and Maintenance

### To Update the App

```bash
# Make changes locally
git add .
git commit -m "Update message"
git push
```

Render will automatically redeploy.

### Regular Maintenance

- Weekly: Check logs for errors
- Monthly: Update dependencies
- Quarterly: Rotate API tokens
- As needed: Update documentation

---

## 📝 Final Notes

1. **Keep your credentials safe** - Never commit .env files
2. **Monitor your services** - Set up alerts for errors
3. **Test thoroughly** - Verify all features work before going live
4. **Have a backup plan** - Regular database backups
5. **Document changes** - Keep README updated

---

## ✨ Ready to Deploy!

You have everything you need:

- ✅ Code is ready and committed
- ✅ Documentation is complete
- ✅ Deployment configuration is set
- ✅ Environment variables are documented
- ✅ Guides are provided for every step

**Next Action**: Push to GitHub and follow the deployment guide!

---

**Checklist Created**: January 11, 2026
**Project**: BareProp Trading Platform
**Status**: Ready for Deployment 🚀
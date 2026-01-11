# Quick Start Guide - Run BareProp App Locally

This guide will help you run the BareProp App on your local machine in 5 minutes.

---

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 15
- npm or yarn

---

## 🚀 Quick Start (5 Steps)

### Step 1: Navigate to Project

```bash
cd "bareprop app"
```

### Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (from root)
cd ../frontend
npm install
```

### Step 3: Set Up Database

```bash
# Create database
createdb bareprop

# Import schema
psql -U postgres -d bareprop -f backend/db/schema.sql

# Or use the setup script
cd backend
node scripts/setup_db.js
```

### Step 4: Configure Environment

```bash
cd backend

# Copy example env file
cp .env.example .env

# Edit .env (minimum required settings):
nano .env
```

**Minimum required in `.env`**:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=bareprop
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_here
STOCKSTRADER_TOKEN=your_token_here
STOCKSTRADER_ACCOUNT_ID=your_account_id
```

### Step 5: Run the Application

**Option A: Run Both Services (Recommended)**
```bash
# From root directory
npm run start
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

---

## 🎉 Access the Application

Once running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🔧 Troubleshooting

### Database Connection Error

**Problem**: `Connection refused` or `authentication failed`

**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                  # Mac

# Test connection
psql -U postgres -d bareprop
```

### Port Already in Use

**Problem**: Port 5000 or 5173 already in use

**Solution**:
```bash
# Find what's using the port
lsof -i :5000
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Dependencies Issues

**Problem**: `npm install` fails

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Default Users

You'll need to create a user to login. Run this script:

```bash
cd backend
node scripts/createAdmin.js
```

Or manually insert into database:

```sql
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2a$10$your_hashed_password', 'admin');
```

To generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
```

---

## 🛠️ Development Tips

### Watch for Changes
Both backend (nodemon) and frontend (Vite) automatically reload on file changes.

### View Logs
- Backend: See terminal output
- Frontend: See browser console (F12)

### Database Queries
```bash
psql -U postgres -d bareprop
```

Common queries:
```sql
-- View users
SELECT * FROM users;

-- View accounts
SELECT * FROM accounts;

-- View recent deals
SELECT * FROM deals ORDER BY close_time DESC LIMIT 10;
```

---

## 📊 Testing the Application

1. **Open Frontend**: http://localhost:5173
2. **Login**: Use your created credentials
3. **Check Dashboard**: Should see connection status
4. **Monitor Console**: Check for WebSocket connection
5. **Test API**: Visit http://localhost:5000/health

---

## 🔒 Default Configuration

The app uses these defaults if not specified:

| Setting | Default |
|---------|---------|
| Backend Port | 5000 |
| Frontend Port | 5173 |
| Database Host | localhost |
| Database Port | 5432 |
| Environment | development |

---

## 📚 Next Steps

1. **Read Full Documentation**: Check `README.md` for detailed setup
2. **Configure StocksTrader**: Add your real API credentials
3. **Set Up Telegram**: Configure bot for notifications (optional)
4. **Customize**: Modify UI and features as needed

---

## 🆘 Need Help?

- Check `README.md` for full documentation
- Review `DEPLOYMENT_GUIDE.md` for deployment
- Check terminal/console for error messages
- Review database logs if sync fails

---

**Happy Trading! 📈**
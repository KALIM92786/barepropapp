# BareProp App - Trading Platform

A full-stack trading platform that mirrors trading accounts using the RoboForex R StocksTrader API with real-time WebSocket updates, authentication, and Telegram bot integration.

## 🚀 Features

- **Real-time Data Sync** - Live trading account updates via WebSocket
- **User Authentication** - JWT-based authentication with role-based access control
- **Performance Analytics** - Equity charts, trade history, and daily statistics
- **Telegram Bot Integration** - Signal broadcasting to Telegram channels
- **Multi-account Support** - Manage and monitor multiple trading accounts
- **Dashboard** - Live monitoring of balance, equity, margin, and positions
- **Docker Support** - Easy deployment with Docker Compose
- **API Token Encryption** - Secure storage of API credentials

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Real-time**: Socket.IO
- **Authentication**: JWT (jsonwebtoken)
- **External API**: RoboForex R StocksTrader

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router DOM
- **Real-time**: Socket.IO Client

## 🛠️ Installation

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 15
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "bareprop app"
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cd backend
   cp .env.example .env
   
   # Edit .env with your actual values
   nano .env
   ```

   Required environment variables:
   - `DB_USER` - PostgreSQL username
   - `DB_PASSWORD` - PostgreSQL password
   - `DB_DATABASE` - Database name
   - `JWT_SECRET` - Secret key for JWT tokens
   - `STOCKSTRADER_TOKEN` - Your StocksTrader API token
   - `STOCKSTRADER_ACCOUNT_ID` - Your StocksTrader account ID

4. **Set up the database**
   ```bash
   cd backend
   
   # Create the database schema
   psql -U postgres -d bareprop -f db/schema.sql
   ```

5. **Create admin user**
   ```bash
   # Use the provided script or manually insert into users table
   node scripts/createAdmin.js
   ```

## 🚦 Running the Application

### Development Mode

Run both backend and frontend:

```bash
# From root directory
npm run start
```

Or run separately:

```bash
# Backend (in terminal 1)
cd backend
npm run dev

# Frontend (in terminal 2)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

### Docker Deployment

```bash
# From backend directory
cd backend
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:5000

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **accounts** - Trading accounts and API tokens
- **account_snapshots** - Historical performance data
- **orders** - Active and historical orders
- **deals** - Executed trades
- **daily_stats** - Daily performance statistics
- **trade_logs** - Audit trail

See `backend/db/schema.sql` for complete schema details.

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication.

### Login Endpoint

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "your_username",
    "role": "admin"
  }
}
```

### Using the Token

Include the token in the Authorization header for protected endpoints:

```bash
Authorization: Bearer jwt_token_here
```

## 📡 API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /health` - Server status and uptime
- `POST /api/auth/login` - User authentication

### Protected Endpoints (Requires Authentication)
- `GET /api/analytics/:accountId` - Account performance data
- `GET /api/trades/:accountId` - Trade history

### WebSocket Events

**Subscribe to account updates:**
```javascript
socket.emit('subscribe', { accountId: 1 });
```

**Receive real-time updates:**
```javascript
socket.on('market_update_1', (data) => {
  console.log('Update:', data);
  // { equity, balance, margin, freeMargin, openOrders }
});
```

## 🤖 Telegram Bot Integration

To enable Telegram notifications:

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Add `TELEGRAM_BOT_TOKEN` to your `.env` file
4. Configure your bot to send signals to your channels

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/config/db.js` for database settings.

### Frontend Configuration

Edit `frontend/src/context/SocketContext.jsx` for WebSocket connection settings.

### Environment Variables

See `.env.example` for all available configuration options.

## 📈 Monitoring and Logging

The application includes:
- Real-time connection status indicators
- Trade logging to database
- Health check endpoints
- Daily statistics aggregation

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d bareprop
```

### WebSocket Connection Issues

- Check CORS configuration in `backend/src/index.js`
- Verify `FRONTEND_URL` in `.env`
- Check firewall settings for port 5000

### Docker Issues

```bash
# View logs
docker-compose logs -f

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Remove volumes (WARNING: deletes database)
docker-compose down -v
```

## 📚 Documentation

- **API Documentation**: See `backend/action_plan_and_progress.md`
- **Database Schema**: See `backend/db/schema.sql`
- **StocksTrader API Guide**: See `backend/StocksTrader REST API.txt`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔒 Security Considerations

- **Never commit `.env` files** to version control
- **Rotate API tokens** regularly
- **Use strong JWT secrets** in production
- **Enable HTTPS** in production
- **Implement rate limiting** on API endpoints
- **Keep dependencies updated**

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check existing documentation

## 🗺️ Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and backtesting
- [ ] Multi-broker support
- [ ] Social trading features
- [ ] Automated trading strategies
- [ ] Performance optimizations

---

**Version**: 1.0.0  
**Last Updated**: January 11, 2026  
**Status**: ✅ Production Ready (with proper configuration)
# BareProp Production Readiness Checklist

## System Verification
- [x] Backend starts with DATABASE_URL
- [x] Frontend builds with VITE_API_URL
- [x] No hardcoded localhost in production
- [x] All imports resolved
- [x] No circular dependencies
- [x] npm run build succeeds
- [ ] npm start succeeds

## Auth & Role System
- [x] JWT payload includes role
- [x] Frontend routes locked by role
- [x] API endpoints protected by role
- [x] Investor sees equity/balance/profit only
- [x] Trader sees signals/history only
- [x] Admin sees everything

## UI Completeness
- [x] Login page works
- [x] Investor dashboard functional
- [x] Signals dashboard functional
- [x] History page works
- [x] Account page works
- [x] Bottom navigation present
- [x] Admin user manager works

## Render Deployment
- [x] package.json scripts correct
- [x] vite build succeeds
- [ ] express start works
- [x] render.yaml configured
- [x] No dev-only dependencies

## Database & Data Flow
- [x] users table valid
- [x] accounts table valid
- [x] deals table valid
- [x] positions table valid
- [x] equity_snapshots table valid
- [x] prices table valid
- [x] trade_logs table valid
- [x] Foreign keys correct
- [x] User → Account linking works

## Final Deliverables
- [ ] ZIP archive created
- [ ] README with setup steps
- [ ] Environment variables documented
- [ ] Render deployment instructions
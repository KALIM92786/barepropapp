import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import InvestorHome from "./pages/InvestorHome";
import SignalsLive from "./pages/SignalsLive";
import SignalsHistory from "./pages/SignalsHistory";
import BottomNav from "./components/BottomNav";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <BrowserRouter>
      {!user ? (
        <Login />
      ) : (
        <>
          <Routes>
            {/* Investor & Admin Routes */}
            {(user.role === "investor" || user.role === "admin") && (
              <>
                <Route path="/" element={<InvestorHome />} />
                <Route path="/investor" element={<InvestorHome />} />
              </>
            )}

            {/* Trader & Admin Routes */}
            {(user.role === "trader" || user.role === "admin") && (
              <>
                <Route path="/signals" element={<SignalsLive />} />
                <Route path="/signals/history" element={<SignalsHistory />} />
              </>
            )}

            {/* Fallback for unknown routes */}
            <Route
              path="*"
              element={
                <Navigate
                  to={user.role === "trader" ? "/signals" : "/investor"}
                  replace
                />
              }
            />
          </Routes>
          <BottomNav role={user.role} />
        </>
      )}
    </BrowserRouter>
  );
}

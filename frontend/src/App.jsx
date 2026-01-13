import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import InvestorHome from "./pages/InvestorHome";
import SignalsLive from "./pages/SignalsLive";
import SignalsHistory from "./pages/SignalsHistory";
import BottomNav from "./components/BottomNav";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading…</div>;
  if (!user) return <Login />;

  return (
    <BrowserRouter>
      <Routes>

        {/* Investor */}
        {user.role === "investor" && (
          <>
            <Route path="/" element={<InvestorHome />} />
            <Route path="/investor" element={<InvestorHome />} />
            <Route path="*" element={<Navigate to="/investor" />} />
          </>
        )}

        {/* Trader (signals) */}
        {user.role === "trader" && (
          <>
            <Route path="/signals" element={<SignalsLive />} />
            <Route path="/signals/history" element={<SignalsHistory />} />
            <Route path="*" element={<Navigate to="/signals" />} />
          </>
        )}

      </Routes>

      <BottomNav role={user.role} />
    </BrowserRouter>
  );
}

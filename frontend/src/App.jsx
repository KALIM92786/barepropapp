import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import InvestorHome from "./pages/InvestorHome";
import SignalsLive from "./pages/SignalsLive";
import SignalsHistory from "./pages/SignalsHistory";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        {user.role === "investor" && (
          <Route path="/*" element={<InvestorHome />} />
        )}

        {user.role === "trader" && (
          <>
            <Route path="/signals" element={<SignalsLive />} />
            <Route path="/signals/history" element={<SignalsHistory />} />
          </>
        )}
      </Routes>

      <BottomNav role={user.role} />
    </BrowserRouter>
  );
}

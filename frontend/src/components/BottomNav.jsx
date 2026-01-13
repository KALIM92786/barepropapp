import { Link, useLocation } from "react-router-dom";

export default function BottomNav({ role }) {
  const path = useLocation().pathname;

  const link = (to, label) => (
    <Link to={to} className={`flex-1 text-center ${path.startsWith(to) ? "text-blue-500" : "text-gray-400"}`}>
      {label}
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t flex p-2">
      {role === "investor" && (
        <>
          {link("/investor", "Home")}
          {link("/investor/equity", "Performance")}
          {link("/account", "Account")}
        </>
      )}

      {role === "trader" && (
        <>
          {link("/signals", "Live")}
          {link("/signals/history", "History")}
          {link("/account", "Account")}
        </>
      )}
    </div>
  );
}

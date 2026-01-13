import { NavLink } from 'react-router-dom';
import { FiGrid, FiZap, FiClock, FiSettings } from 'react-icons/fi';

// Define links for each role
const investorLinks = [
  { to: '/investor', label: 'Dashboard', icon: FiGrid },
];

const traderLinks = [
  { to: '/signals', label: 'Live', icon: FiZap },
  { to: '/signals/history', label: 'History', icon: FiClock },
];

// Admin sees all links
const adminLinks = [
  ...investorLinks,
  ...traderLinks,
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const roleLinks = {
  investor: investorLinks,
  trader: traderLinks,
  admin: adminLinks,
};

// Reusable NavLink item with active styling
const NavItem = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    end // Use 'end' to prevent parent routes from matching
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full text-xs transition-colors ${
        isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
      }`
    }
  >
    {Icon && <Icon className="w-5 h-5 mb-0.5" />}
    <span>{label}</span>
  </NavLink>
);

export default function BottomNav({ role }) {
  const links = roleLinks[role] || [];

  // Don't render the nav if the role has no links or is invalid
  if (links.length === 0) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 h-16 flex justify-around items-center md:hidden">
      {links.map((link) => (
        <NavItem key={link.to} to={link.to} label={link.label} icon={link.icon} />
      ))}
    </nav>
  );
}
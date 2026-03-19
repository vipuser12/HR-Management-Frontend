import { NavLink } from 'react-router-dom';

export default function NavItem({ to, icon, label, isOpen, activeColor = "bg-blue-600" }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3 rounded-lg transition-colors w-full ${isActive ? activeColor + " text-white" : 'hover:bg-slate-800 text-gray-300'
        }`
      }
    >
      <span className="w-6 flex justify-center">{icon}</span>
      {isOpen && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
}

import { LayoutDashboard, ShieldCheck, Users, HandCoins, LogOut, Briefcase } from 'lucide-react';
import NavItem from './NavItem';

export default function Sidebar({ isOpen }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Briefcase size={20} />
        </div>
        {isOpen && <span className="font-bold text-lg whitespace-nowrap">HR System</span>}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isOpen} />
        <NavItem to="/users" icon={<ShieldCheck size={20} />} label="User Management" isOpen={isOpen} activeColor="bg-purple-600" />
        <NavItem to="/employees" icon={<Users size={20} />} label="Employees" isOpen={isOpen} activeColor="bg-blue-500" />
        <NavItem to="/salaries" icon={<HandCoins size={20} />} label="Salaries" isOpen={isOpen} activeColor="bg-purple-700" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center gap-4 p-3 text-red-400 hover:bg-slate-800 w-full rounded-lg transition-colors">
          <LogOut size={20} />
          {isOpen && <span >Logout</span>}
        </button>
      </div>
    </aside>
  );
}

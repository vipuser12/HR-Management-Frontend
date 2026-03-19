import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Zap, DollarSign, Users, UserPlus, Settings, Mail } from 'lucide-react';

export default function Dashboard({ user }) {
  const navigate = useNavigate();


  const rawData = user?.permission || user?.permissions || [];
  const permissions = (Array.isArray(rawData) ? rawData : [rawData])
    .map(p => String(p).toLowerCase().trim().replace(/\s+/g, '_'));


  const hasAccess = (key) => {

    if (user?.role?.toLowerCase() === 'admin') return true;
    return permissions.includes(key.toLowerCase());
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.username?.[0].toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{user?.username}</h3>
              <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active Session
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-400 flex items-center gap-2"><User size={14} /> Role</span>
              <span className="font-semibold text-gray-700">{user?.role || 'User'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 flex items-center gap-2"><Mail size={14} /> Email</span>
              <span className="font-semibold text-gray-700 text-[11px] truncate max-w-37.5">
                {user?.emailaddress || user?.email || 'N/A'}
              </span>
            </div>
          </div>
        </div>


        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2 space-y-6">

          <div>
            <h3 className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={16} /> Authorized Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {permissions.map((perm, index) => (
                <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase border border-blue-100">
                  {perm.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-gray-50" />

          <div>
            <h3 className="text-gray-700 font-bold flex items-center gap-2 mb-4 text-sm">
              <Zap size={16} className="text-yellow-500" /> Quick Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


              {(hasAccess('view_payroll') || hasAccess('view_salaries')) && (
                <button onClick={() => navigate('/salaries')} className="bg-purple-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition shadow-sm">
                  <DollarSign size={20} /> View Payroll
                </button>
              )}


              {hasAccess('view_employees') && (
                <button onClick={() => navigate('/employees')} className="bg-blue-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition shadow-sm">
                  <Users size={20} /> View Employees
                </button>
              )}


              {hasAccess('manage_users') && (
                <button onClick={() => navigate('/users')} className="bg-red-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition shadow-sm">
                  <Settings size={20} /> Manage Users
                </button>
              )}


              {(hasAccess('add_employee') || hasAccess('create_employee')) && (
                <button onClick={() => navigate('/employees')} className="bg-green-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition shadow-sm">
                  <UserPlus size={20} /> Add Employee
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

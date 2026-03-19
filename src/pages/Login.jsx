import { Briefcase, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Login({ setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Invalid username or password');

      const data = await response.json();
      localStorage.setItem('token', data.token);

      const decoded = jwtDecode(data.token);

      
      let permissions = [];
      const rawPerms = decoded.permission || [];

      if (Array.isArray(rawPerms)) {
        permissions = rawPerms.map(p => p.toUpperCase());
      } else if (rawPerms) {
        permissions = [rawPerms.toUpperCase()];
      }
      

      setUser({
        username: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role,
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "",
        permissions: permissions 
      });

      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
    <div className="bg-[#1976d2] p-4 text-white text-center font-medium shadow-md">
        HR Login
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-5 bg-white rounded-3xl shadow-sm text-[#1976d2] border border-gray-100">
            <Briefcase size={60} fill="currentColor" fillOpacity={0.1} />
          </div>
          <h1 className="text-2xl font-bold text-[#1976d2] tracking-tight">
            HR Management System
          </h1>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1976d2] transition-colors" size={20} />
              <input
                required
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1976d2] transition-colors" size={20} />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="cursor-pointer w-full bg-[#1976d2] text-white py-4 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Login'}
          </button>
        </form>

        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">localhost</p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { User, Lock, Plus, Edit2, Loader2, X, Trash2, ShieldAlert, Mail, UserCircle } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export default function Users() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleName: 'User'
  });

  const BASE_URL = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const hasPermission = (perm) => userPermissions.includes(perm);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserPermissions(decoded.permission || []);
      } catch (err) { console.error("Decode Error", err); }
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const res = await axios.get(`${BASE_URL}/User`, { headers });
      const data = res.data.data || res.data || [];
      setUsersList(data.map(u => ({
        id: u.id,
        name: u.username || u.userName,
        email: u.email || 'N/A',
        role: u.roleName || u.role || 'User',
        initial: (u.username || 'U').charAt(0).toUpperCase()
      })));
    } catch (err) {
      setErrorStatus(err.response?.status || 500);
    } finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser ? `${BASE_URL}/User/${editingUser.id}` : '${BASE_URL}/User';
      const method = editingUser ? 'put' : 'post';
      await axios[method](url, formData, { headers });
      setIsModalOpen(false);
      fetchUsers();
      alert("User Created/Updated Successfully!");
    } catch (err) {
      alert(`Error: ${err.response?.status}`);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;


  if (errorStatus === 403) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
      <div className="bg-red-50 p-6 rounded-3xl mb-6 shadow-sm"><ShieldAlert size={64} className="text-red-500" /></div>
      <h2 className="text-3xl font-black text-slate-800">Access Restricted</h2>
      <p className="text-slate-500 mt-3 max-w-sm">Your current account does not have <span className="text-red-600 font-bold italic">"manage_users"</span> permissions.</p>
      <button onClick={() => window.location.reload()} className="mt-8 bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold">Retry Connection</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-4xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Users</h2>
          <p className="text-slate-400 text-sm font-medium italic">Manage roles & access</p>
        </div>
        {hasPermission("manage_users") && (
          <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white flex items-center gap-2 px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all">
            <Plus size={20} /> Add User
          </button>
        )}
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usersList.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm relative group hover:shadow-md transition-all">
            {hasPermission("manage_users") && (
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingUser(user); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"><Edit2 size={16} /></button>
                <button onClick={() => { if (confirm("Delete?")) axios.delete(`https://localhost:7027/api/User/${user.id}`, { headers }).then(fetchUsers) }} className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black">{user.initial}</div>
              <div className="truncate pr-10">
                <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</span>
              <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm">{user.role}</span>
            </div>
          </div>
        ))}
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex justify-center items-end md:items-center">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="bg-indigo-700 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingUser ? 'Update User' : 'Create User'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Username Input with Icon */}
              <div className="relative">
                <UserCircle className="absolute left-4 top-4 text-slate-400" size={20} />
                <input placeholder="Username" required className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-indigo-500 outline-none"
                  value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              </div>

              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                <input placeholder="Email" required type="email" className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-indigo-500 outline-none"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              {/* FirstName & LastName (New Feature) */}
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-indigo-500 outline-none"
                  value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                <input placeholder="Last Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-indigo-500 outline-none"
                  value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>

              {!editingUser && (
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input placeholder="Password" required type="password" className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-indigo-500 outline-none"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-2xl text-xs text-blue-600 font-medium">
                Note: New users will be created with basic permissions. You can assign roles after creation.
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg">
                {editingUser ? 'Save Changes' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

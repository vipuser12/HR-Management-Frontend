import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, MoreHorizontal, X } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const initialFormState = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    jobTitle: '',
    hireDate: new Date().toISOString().split('T')[0]
  };

  const BASE_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState(initialFormState);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/Employee`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const payload = {
        userId: Number(formData.userId),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        jobTitle: formData.jobTitle,
        hireDate: new Date(formData.hireDate).toISOString(),
        isActive: true
      };
      console.log("Sending Payload:", payload);
      await axios.post(`${BASE_URL}/Employee`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchEmployees();
      alert("Employee saved successfully!");
    } catch (error) {
      const detailedError = error.response?.data?.error || error.response?.data?.message || "Unknown Error";
      alert("Database Error: " + detailedError);
      console.error("Full Server Response:", error.response?.data);
    }

  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://localhost:7027/api/Employee/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });


        setEmployees(employees.filter(emp => emp.id !== id));
        alert("Employee deleted successfully!");
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to delete employee";
        alert("Error: " + errorMsg);
        console.error("Delete error:", error);
      }
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const name = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) ||
      emp.department?.toLowerCase().includes(search) ||
      emp.id?.toString().includes(search);
  });

  if (loading) return <div className="p-10 text-center font-bold text-blue-600">Loading...</div>;

  return (
    <div className="animate-in fade-in duration-500 space-y-6 relative">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
          <p className="text-gray-400 text-sm font-medium">Manage your staff members</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-md active:scale-95"
        >
          <Plus size={20} /> Add Employee
        </button>
      </div>


      <div className="flex gap-4 items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm mx-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, ID or department..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 text-gray-500 bg-gray-50/50 rounded-xl hover:bg-gray-100 transition font-bold text-sm border border-gray-100">
          <Filter size={18} /> Filters
        </button>
      </div>


      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden mx-2">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-widest">
              <th className="px-6 py-5">Employee</th>
              <th className="px-6 py-5">Department</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs">
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{emp.firstName} {emp.lastName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{emp.jobTitle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-medium">{emp.department}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${emp.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {emp.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="text-red-400 hover:text-red-600 transition p-2 bg-red-50 hover:bg-red-100 rounded-lg"
                      title="Delete Employee"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">New Employee</h3>
                <p className="text-xs text-gray-400 font-medium">Fill in the official details</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Linked User ID</label>
                  <input required type="number" placeholder="Enter User ID from database" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                    value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">First Name</label>
                  <input required type="text" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl outline-none text-sm font-medium"
                    value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Last Name</label>
                  <input required type="text" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl outline-none text-sm font-medium"
                    value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Email Address</label>
                <input required type="email" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl outline-none text-sm font-medium"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 md:gro gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Phone Number</label>
                  <input required type="text" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl outline-none text-sm font-medium"
                    placeholder="01xxxxxxxxx"
                    value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Job Title</label>
                  <input required type="text" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl outline-none text-sm font-medium"
                    placeholder="Software Engineer"
                    value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Department</label>
                  <input type="text" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl outline-none text-sm font-medium"
                    value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Hire Date</label>
                  <input required type="date" className="w-full p-3.5 bg-gray-50/80 border border-gray-100 rounded-2xl outline-none text-sm font-medium"
                    value={formData.hireDate} onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition shadow-sm">Cancel</button>
                <button type="submit" className="flex-1 py-4 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

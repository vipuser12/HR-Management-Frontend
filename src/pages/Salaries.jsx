import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Edit2, X, Plus, AlertCircle, Loader2 } from 'lucide-react';

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    baseSalary: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  const BASE_URL = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);

    try {
      
      const salRes = await axios.get(`${BASE_URL}/Payroll/salaries`, { headers });
      setSalaries(salRes.data.data || salRes.data);
    } catch (error) {
      console.error("Salaries Error:", error.response?.status);
      if (error.response?.status === 403) alert("Denied: Salaries");
    }

    try {
      
      const empRes = await axios.get(`${BASE_URL}/Employee`, { headers });
      setEmployees(empRes.data.data || empRes.data);
    } catch (error) {
      console.log("Note: User cannot view employee list for dropdown");
      
    }

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        employeeId: parseInt(formData.employeeId),
        baseSalary: parseFloat(formData.baseSalary),
        effectiveDate: formData.effectiveDate
      };

      await axios.post(`${BASE_URL}/Payroll/set-salary`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsModalOpen(false);
      setFormData({ employeeId: '', baseSalary: '', effectiveDate: new Date().toISOString().split('T')[0] });
      fetchData();
      alert("Salary updated successfully!");
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Check permissions"));
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-purple-600 font-bold gap-4">
      <Loader2 className="animate-spin" size={40} />
      <p>Retrieving Payroll Records...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Payroll Management</h2>
          <p className="text-sm text-gray-400 font-medium">Manage base salaries and effective dates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-800 transition shadow-lg shadow-purple-100"
        >
          <Plus size={18} /> Set Salary
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-5">Employee</th>
              <th className="px-8 py-5">Username</th>
              <th className="px-8 py-5">Base Salary</th>
              <th className="px-8 py-5 text-right">Effective Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {salaries.length > 0 ? (
              salaries.map((sal) => (
                <tr key={sal.id} className="hover:bg-purple-50/20 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xs">
                        {sal.employee?.firstName?.[0]}{sal.employee?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{sal.employee?.firstName} {sal.employee?.lastName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{sal.employee?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-gray-500">
                    @{sal.employee?.username || 'no_user'}
                  </td>
                  <td className="px-8 py-4 font-black text-green-600">
                    ${sal.baseSalary?.toLocaleString()}
                  </td>
                  {/* عرض التاريخ مكان زر التعديل */}
                  <td className="px-8 py-4 text-right">
                    <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                      {sal.effectiveDate ? new Date(sal.effectiveDate).toLocaleDateString('en-GB') : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-gray-400">
                  <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                  <p className="font-bold">No salary data found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-purple-700 text-white">
              <h3 className="text-xl font-black">Set Salary</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Select Employee</label>
                <select
                  required
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold mt-1"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                >
                  <option value="">Choose...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Annual Salary</label>
                <input required type="number" step="0.01" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold"
                  value={formData.baseSalary} onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">Effective Date</label>
                <input required type="date" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold"
                  value={formData.effectiveDate} onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-4 font-black text-white bg-purple-700 rounded-2xl shadow-lg">Update Payroll</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

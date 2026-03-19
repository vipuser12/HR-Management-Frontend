import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Salaries from './pages/Salaries';
import Employees from './pages/Employees';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token Data:", decoded); 

        
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;

        
        let permissions = [];
        const rawPerms = decoded.permission || [];

        if (Array.isArray(rawPerms)) {
          permissions = rawPerms.map(p => p.toUpperCase());
        } else if (rawPerms) {
          permissions = [rawPerms.toUpperCase()];
        }

        
        if (permissions.length === 0) {
          try {
            const res = await axios.get('https://localhost:7027/api/Role/permissions', {
              headers: { Authorization: `Bearer ${token}` }
            });
            const apiData = res.data.data || [];
            permissions = apiData.map(p => p.name.toUpperCase());
          } catch (err) {
            console.warn("API Error - Using Role-Based Fallback for Role:", userRole);
            
            if (userRole?.toLowerCase() === 'admin') {
              permissions = ['VIEW EMPLOYEES', 'CREATE EMPLOYEE', 'EDIT EMPLOYEE', 'MANAGE USERS', 'VIEW PAYROLL', 'SET SALARY'];
            } else if (userRole === 'HR Manager') {
              permissions = ['VIEW EMPLOYEES', 'CREATE EMPLOYEE', 'EDIT EMPLOYEE', 'MANAGE USERS'];
            } else if (userRole === 'HR Financial') {
              permissions = ['VIEW PAYROLL', 'SET SALARY'];
            }
          }
        }

        setUser({
          username: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name || "Guest",
          role: userRole,
          email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "user@hr.com",
          permissions: permissions
        });

      } catch (error) {
        console.error("Auth Initialization Error", error);
        localStorage.removeItem('token');
      }
    };

    initializeUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
                <Sidebar isOpen={sidebarOpen} userRole={user?.role} permissions={user?.permissions} />
                <div className="flex-1 flex flex-col overflow-auto">
                  <Header user={user} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                  <main className="p-4 md:p-8">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard user={user} />} />
                      <Route path="/users" element={<Users user={user} />} />
                      <Route path="/salaries" element={<Salaries user={user} />} />
                      <Route path="/employees" element={<Employees user={user} />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

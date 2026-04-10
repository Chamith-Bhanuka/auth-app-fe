import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const endpointConfig = [
  { name: 'System Metrics', path: '/dashboard/system-metrics', roles: ['SUPER_ADMIN'] },
  { name: 'Manage Tenants', path: '/dashboard/manage-tenants', roles: ['SUPER_ADMIN'] },
  { name: 'Tenant Reports', path: '/dashboard/tenant-reports', roles: ['SUPER_ADMIN', 'TENANT','EMPLOYEE'] },
  { name: 'Manage Employees', path: '/dashboard/manage-employees', roles: ['SUPER_ADMIN', 'TENANT','EMPLOYEE'] },
  { name: 'Tenant Settings', path: '/dashboard/tenant-settings', roles: ['SUPER_ADMIN', 'TENANT'] },
  { name: 'Employee Tasks', path: '/dashboard/employee-tasks', roles: ['SUPER_ADMIN', 'TENANT', 'EMPLOYEE'] },
  { name: 'Customer Home', path: '/dashboard/customer-home', roles: ['SUPER_ADMIN', 'TENANT', 'EMPLOYEE', 'CUSTOMER'] },
];

export default function App() {
  const [page, setPage] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) setPage('dashboard');
  }, []);

  const login = async () => {
    try {
      const res = await api.post('/auth/login', loginData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setRole(res.data.role);
      setPage('dashboard');
      setMessage('Login success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async () => {
    try {
      const res = await api.post('/auth/register', registerData);
      setMessage(res.data.message || 'Register success');
      setPage('login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Register failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    setRole('');
    setPage('login');
    setMessage('Logged out');
  };

  const callEndpoint = async (path) => {
    try {
      const res = await api.get(path);
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Request failed');
    }
  };

  if (page === 'login') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-xl shadow w-96 space-y-4">
            <h1 className="text-2xl font-bold">Login</h1>
            <input
                className="w-full border p-2 rounded"
                placeholder="Email"
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <input
                className="w-full border p-2 rounded"
                type="password"
                placeholder="Password"
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button onClick={login} className="w-full bg-blue-500 text-white p-2 rounded">
              Login
            </button>
            <button onClick={() => setPage('register')} className="w-full text-blue-500">
              Go Register
            </button>
            <p className="text-sm text-red-500">{message}</p>
          </div>
        </div>
    );
  }

  if (page === 'register') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-xl shadow w-96 space-y-4">
            <h1 className="text-2xl font-bold">Register</h1>
            <input
                className="w-full border p-2 rounded"
                placeholder="Name"
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            />
            <input
                className="w-full border p-2 rounded"
                placeholder="Email"
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <input
                className="w-full border p-2 rounded"
                type="password"
                placeholder="Password"
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <select
                className="w-full border p-2 rounded"
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
            >
              <option>CUSTOMER</option>
              <option>EMPLOYEE</option>
              <option>TENANT</option>
            </select>
            <button onClick={register} className="w-full bg-green-500 text-white p-2 rounded">
              Register
            </button>
            <button onClick={() => setPage('login')} className="w-full text-blue-500">
              Go Login
            </button>
            <p className="text-sm text-red-500">{message}</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p>
                Logged Role: <span className="font-semibold">{role}</span>
              </p>
            </div>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {endpointConfig.map((ep) => {
              const hasAccess = ep.roles.includes(role);
              return (
                  <button
                      key={ep.path}
                      onClick={() => callEndpoint(ep.path)}
                      className={`p-4 rounded text-white ${hasAccess ? 'bg-green-500' : 'bg-red-500'}`}
                  >
                    <div className="font-bold">{ep.name}</div>
                    <div className="text-sm">{ep.path}</div>
                    <div className="text-xs mt-1">Access: {ep.roles.join(', ')}</div>
                  </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="font-bold">Response:</h2>
            <p>{message}</p>
          </div>
        </div>
      </div>
  );
}
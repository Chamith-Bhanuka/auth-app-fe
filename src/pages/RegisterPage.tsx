import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth.service.ts';

export default function RegisterPage() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await register(data);
      if (response.success) {
        alert('Registration successful! Please login.');
        navigate('/');
      }
    } catch {
      alert('Register failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-xl rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 text-shadow-sm">
          Create Account
        </h1>

        <div className="space-y-4">
          <input
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Full Name"
            disabled={loading}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <input
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Email Address"
            disabled={loading}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <input
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            type="password"
            placeholder="Password"
            disabled={loading}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <div className="relative">
            <label className="text-xs text-gray-500 mb-1 block">
              Account Type
            </label>
            <select
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500 outline-none bg-white"
              disabled={loading}
              onChange={(e) => setData({ ...data, role: e.target.value })}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="TENANT">Tenant</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold p-3 w-full rounded-md transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/" className="text-green-600 font-bold hover:underline">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}

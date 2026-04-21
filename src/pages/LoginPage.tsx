import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth.service.ts';
import { setCredentials } from '../store/authSlice';

export default function LoginPage() {
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await login(data); // returns ApiResponse

      if (response.success && response.data) {
        dispatch(
          setCredentials({
            email: data.email,
            role: response.data.role,
          })
        );
        navigate('/dashboard');
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-xl rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 text-shadow-sm">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="space-y-4">
          <input
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email Address"
            disabled={loading}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <input
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            type="password"
            placeholder="Password"
            disabled={loading}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 w-full rounded-md transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:underline"
          >
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}

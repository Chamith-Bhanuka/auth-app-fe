import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { ENDPOINTS } from '../constants/endpoints';
import { getMyPermissions, callEndpoint } from '../services/dashboard.service';
import { logoutUser } from '../services/auth.service';
import EndpointButton from '../components/EndpointButton';

export default function DashboardPage() {
  const [allowed, setAllowed] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await getMyPermissions();
      setAllowed(data || []);
    } catch (err) {
      console.error('Failed to load permissions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);

      dispatch(logout());
      navigate('/');
    }
  };

  const handleClick = async (path: string) => {
    setMessage('Processing...');
    try {
      const response = await callEndpoint(path);
      setMessage(response.data || response.message || 'Action successful');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Access Denied');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800 text-shadow-sm">
            Dashboard
          </h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            {user?.role || 'Guest'}
          </span>
        </div>

        <div className="flex gap-3">
          {user?.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">
              Checking your permissions...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENDPOINTS.map((ep) => (
              <EndpointButton
                key={ep.path}
                name={ep.name}
                path={ep.path}
                hasAccess={allowed.includes(ep.path)}
                loading={false}
                onClick={handleClick}
              />
            ))}
          </div>
        )}

        {message && (
          <div className="mt-8 p-4 border-l-4 border-blue-500 bg-blue-50 rounded text-blue-800 animate-fade-in shadow-sm">
            <span className="font-bold">System Response:</span> {message}
          </div>
        )}
      </main>
    </div>
  );
}

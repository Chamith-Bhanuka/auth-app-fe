import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../constants/endpoints';
import {
  searchUsers,
  getUserPermissions,
  assignPermissions,
} from '../services/admin.service';

export default function AdminPermissionPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // loading state for Save action

  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  // check role when enter
  useEffect(() => {
    if (!user || user.role !== 'SUPER_ADMIN') {
      alert('Access Denied: Administrators only.');
      navigate('/');
    }
  }, [user, navigate]);

  // search
  useEffect(() => {
    if (search.length > 1) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setUsers([]);
      setShowSuggestions(false);
    }
  }, [search]);

  const handleSearch = async () => {
    try {
      const response = await searchUsers(search);
      const data = response.data || response;
      setUsers(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleSelectUser = async (user: any) => {
    setSelected(user);
    setSearch(user.email);
    setShowSuggestions(false);

    try {
      const response = await getUserPermissions(user.id);
      // access the array from the ApiResponse data field
      setPermissions(response.data || response);
    } catch (err) {
      console.error('Failed to load permissions', err);
    }
  };

  const togglePermission = (path: string) => {
    setPermissions((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await assignPermissions(selected.id, permissions);
      if (response.success) {
        alert('Permissions updated successfully');
      }
    } catch (err) {
      alert('Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        Admin Permission Management
      </h1>

      {/* Search Section */}
      <div className="relative mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Find User
        </label>
        <input
          className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search.length > 1 && setShowSuggestions(true)}
        />

        {showSuggestions && users.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 flex flex-col"
                onClick={() => handleSelectUser(u)}
              >
                <span className="font-bold text-gray-800">{u.name}</span>
                <span className="text-sm text-gray-500">{u.email}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permissions Section */}
      {selected ? (
        <div className="bg-white p-6 border rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-600">
              Editing Access:{' '}
              <span className="text-gray-800 underline">{selected.name}</span>
            </h2>
            <p className="text-sm text-gray-500 italic">{selected.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {ENDPOINTS.map((ep) => (
              <label
                key={ep.path}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  permissions.includes(ep.path)
                    ? 'bg-green-50 border-green-400'
                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  checked={permissions.includes(ep.path)}
                  onChange={() => togglePermission(ep.path)}
                />
                <div className="ml-3">
                  <div className="font-bold text-sm text-gray-700">
                    {ep.name}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    {ep.path}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
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
                Saving Changes...
              </>
            ) : (
              'Apply Permission Updates'
            )}
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-20 border-4 border-dashed rounded-3xl bg-white/50">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">
            Select a user to modify their system permissions
          </p>
        </div>
      )}
    </div>
  );
}

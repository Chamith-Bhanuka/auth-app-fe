import api from './api';

export const searchUsers = async (query: string) => {
  const res = await api.get(`/user/search?name=${query}`);
  return res.data;
};

export const getUserPermissions = async (userId: number) => {
  const res = await api.get(`/permissions/user/${userId}`);
  return res.data;
};

export const assignPermissions = async (
  userId: number,
  permissions: string[]
) => {
  const res = await api.post('/permissions/assign', {
    userId,
    permissions,
  });
  return res.data;
};

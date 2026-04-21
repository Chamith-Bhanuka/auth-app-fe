import api from './api';

export const getMyPermissions = async () => {
  const res = await api.get('/permissions/my');
  return res.data;
};

export const callEndpoint = async (path: string) => {
  const res = await api.get(path);
  return res.data;
};

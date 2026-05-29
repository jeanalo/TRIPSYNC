import { getAxiosInstance } from '@/context/AxiosProvider';

export const apiClient = {
  get: <T>(path: string) =>
    getAxiosInstance()
      .get<T>(path)
      .then((r) => r.data),
  post: <T>(path: string, body?: unknown) =>
    getAxiosInstance()
      .post<T>(path, body)
      .then((r) => r.data),
  put: <T>(path: string, body?: unknown) =>
    getAxiosInstance()
      .put<T>(path, body)
      .then((r) => r.data),
  delete: <T>(path: string) =>
    getAxiosInstance()
      .delete<T>(path)
      .then((r) => r.data),
};

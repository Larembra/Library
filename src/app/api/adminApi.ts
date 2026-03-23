import api from './client';
import type { UserProfile } from './authApi';

export interface StatsResponse {
  total_books: number;
  total_users: number;
  total_comments: number;
  total_readings: number;
}

export const adminApi = {
  getStats: () =>
    api.get<StatsResponse>('admin/stats'),

  getUsers: () =>
    api.get<UserProfile[]>('admin/users'),

  createUser: (data: { username: string; email: string; password: string }) =>
    api.post<UserProfile>('admin/users', data),

  blockUser: (userId: number) =>
    api.put(`admin/users/${userId}/block`),

  unblockUser: (userId: number) =>
    api.put(`admin/users/${userId}/unblock`),
};

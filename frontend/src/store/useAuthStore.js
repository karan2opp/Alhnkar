import { create } from "zustand";
import { getMe, refreshToken } from "../auth/auth.service";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,
  isAdmin: false,

  setUser: (userData, token) =>
    set({
      user: userData,
      accessToken: token,
      isLoggedIn: true,
      isAdmin: userData?.role === "admin",
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  fetchCurrentUser: () => getMe(set),

  refreshAccessToken: () => refreshToken(set),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      isAdmin: false,
    }),
}));
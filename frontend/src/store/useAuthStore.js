import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isAdmin: false,

  setUser: (userData) =>
    set({
      user: userData,
      isLoggedIn: true,
      isAdmin: userData?.role === "admin",
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      isAdmin: false,
    }),
}));
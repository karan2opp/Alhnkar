import { create } from "zustand";
import { getMe, refreshToken,logoutService } from "../auth/auth.service";

export const useAuthStore = create((set) => ({
  // ── State (all fields declared upfront) ─────────────
  user: null,              // { _id, name, email, role }
  accessToken: null,       // 🔐 Memory-only (no persist)
  isLoggedIn: false,
  isAdmin: false,          // Will be computed on setUser/getMe
  loading: false,          // ← Added: was missing but used in getMe
  error: null,             // ← Added: was missing but used in getMe

  // ── Actions ─────────────────────────────────────────

  /**
   * Set user + token after login
   */
  setUser: (userData, token) => {
    const isAdmin = userData?.role === "admin";
    set({
      user: userData,
      accessToken: token,
      isLoggedIn: true,
      isAdmin,
      isInitialized: false,
      loading: false,
      error: null,

    });
  },

  /**
   * Update access token only
   */
  setAccessToken: (token) => set({ accessToken: token }),
setInitialized: (value) => set({ isInitialized: value }),
  /**
   * Fetch current user from API
   */
fetchCurrentUser: async () => await getMe(set),
  /**
   * Refresh access token
   */
  refreshAccessToken: () => refreshToken(set),

  /**
   * Logout — clear all auth state
   */
logout: () => logoutService(set),

  // ── Optional: Helper to clear error ─────────────────
  clearError: () => set({ error: null }),
}));

// ── Helper Hooks (for components) ─────────────────────
export const useIsAdmin = () => 
  useAuthStore((state) => state.user?.role === "admin");

export const useUserRole = () => 
  useAuthStore((state) => state.user?.role);
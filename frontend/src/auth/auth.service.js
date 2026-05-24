import api from "../utils/axios.js";

/**
 * Fetch current user + compute isAdmin
 */
export const getMe = async (set) => {
  try {
    set({ loading: true, error: null });

    const res = await api.get("/auth/me");
    const userData = res.data?.data;
    
    // ✅ Compute isAdmin from role
    const isAdmin = userData?.role === "admin";

    set({
      user: userData,
      isLoggedIn: true,
      isAdmin,
      loading: false,
      error: null, // Clear any previous error
    });

    return userData;
  } catch (error) {
    set({
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      loading: false,
      error: error.response?.data?.message || "Failed to fetch user",
    });
    return null;
  }
};

/**
 * Refresh access token — preserve user data
 */
export const refreshToken = async (set) => {
  try {
    const res = await api.post("/auth/refreshToken");
    const newToken = res.data?.data?.accessToken;
    
    if (!newToken) throw new Error("No access token received");

    // ✅ Only update token — keep user/isLoggedIn/isAdmin unchanged
    set({ accessToken: newToken });
    return true;
  } catch (error) {
    // ❌ Don't clear user on refresh failure — let getMe handle auth
    set({
      accessToken: null,
      error: error.response?.data?.message || "Failed to refresh token",
    });
    return false;
  }
};
export const logoutService = async (set) => {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true }); // clears httpOnly cookie
  } catch (err) {
    console.error("Logout failed:", err.message);
    // still clear frontend state even if backend fails
  } finally {
    set({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      isAdmin: false,
      loading: false,
      error: null,
    });
  }
};
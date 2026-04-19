import api from "../utils/axios";

export const getMe = async (set) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get("/auth/me");

    /*
      Expected response:

      {
        success: true,
        message: "User fetched successfully",
        data: {
          _id,
          name,
          email,
          role
        }
      }
    */

    set({
      user: res.data.data,
      isLoggedIn: true,
      loading: false,
    });
    

    return res.data.data;
  } catch (error) {
    set({
      user: null,
      isLoggedIn: false,
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch user",
    });

    return null;
  }
};
export const refreshToken = async (set) => {
  try {
    const res = await api.post("/auth/refreshToken");

    set({
      accessToken: res.data.data.accessToken,
      isLoggedIn: true,
    });

    return true;
  } catch (error) {
    set({
      accessToken: null,
      user: null,
      isLoggedIn: false,
    });

    return false;
  }
};
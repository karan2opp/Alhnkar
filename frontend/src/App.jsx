import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App({ children }) {
  const { refreshAccessToken, fetchCurrentUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshed = await refreshAccessToken();
      console.log("refresh token", refreshed);

      if (refreshed) {
        const res = await fetchCurrentUser();
      }

      // ✅ mark auth as complete, regardless of success/failure
      setInitialized(true);
    };

    initializeAuth();
  }, []);

  return children;
}

export default App;
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App({ children }) {
  const {
    refreshAccessToken,
    fetchCurrentUser,
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshed = await refreshAccessToken();

  

      if (refreshed) {
        await fetchCurrentUser();

        
      }
    };

    initializeAuth();
  }, []);

  return children;
}

export default App;
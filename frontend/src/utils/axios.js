import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // https://yourapi.com/api
  withCredentials: true,                   // sends cookies with every request
  timeout: 10000,                          // 10 seconds — don't wait forever
})
console.log(import.meta.env.VITE_API_URL);
// request interceptor
api.interceptors.request.use(
  (config) => {
    // you can attach tokens here if needed later
    return config
  },
  (error) => Promise.reject(error)
)

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || "Something went wrong"

    if (status === 401) {
      // token expired or not logged in — redirect to login
      window.location.href = "/login"
    }

    if (status === 403) {
      // logged in but not authorized
      window.location.href = "/"
    }

    if (status === 500) {
      console.error("Server error:", message)
    }

    return Promise.reject(error)
  }
)

export default api
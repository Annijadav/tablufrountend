import axios from "axios";

export const URL = "http://localhost:5000/api";

// Create an axios instance
const axioInstance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor
axioInstance.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage each time a request is made
    if (typeof localStorage !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers["authtoken"] = token;
        config.headers["login"] = "true";
      }
    }
    return config;
  },
  (error) => {
    console.log(error, "this is error call");
    return Promise.reject(error);
  }
);

export default axioInstance;

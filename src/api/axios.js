import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ your Spring Boot backend base path
  headers: {
    "Content-Type": "application/json", // ✅ set content type for JSON requests
  },
  withCredentials: true, // ✅ send and receive cookies (e.g., JWT in HttpOnly cookie)
});

export default api;

import { api } from "./http";

export const register = (payload) => api.post("/api/register", payload);
export const login    = (payload) => api.post("/api/login", payload);
export const logout   = () => api.post("/api/logout");
export const me       = () => api.get("/api/me");

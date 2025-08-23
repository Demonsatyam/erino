import { api } from "./http";

// filters is an object like { q, status, source, city, score_gt, score_lt, created_before, created_after }
export const listLeads = (page=1, limit=10, filters={}) =>
  api.get("/api/leads", { params: { page, limit, ...filters } });

export const getLead    = (id)         => api.get(`/api/leads/${id}`);
export const createLead = (payload)    => api.post("/api/leads", payload);
export const updateLead = (id, payload)=> api.put(`/api/leads/${id}`, payload);
export const deleteLead = (id)         => api.delete(`/api/leads/${id}`);

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("panel_token");
  if (t) config.headers["x-api-key"] = t;
  return config;
});

export const listChats = () => api.get("/api/chats").then(r => r.data);
export const listMessages = (phone) => api.get(`/api/messages/${encodeURIComponent(phone)}`).then(r => r.data);

export const sendText = (to, text) =>
  api.post("/api/messages/send", { to, type: "text", text }).then(r => r.data);

export const sendTemplate = (to, name, language="es", components=[]) =>
  api.post("/api/messages/send", {
    to,
    type: "template",
    template: { name, language, components }
  }).then(r => r.data);

export const listTemplates = () => api.get("/api/templates").then(r => r.data);

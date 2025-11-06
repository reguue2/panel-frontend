import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const sendMessage = (to, text) =>
  API.post("/send-message", { to, text });

export const sendTemplate = (to, templateName, lang = "es") =>
  API.post("/send-template", { to, templateName, lang });

export const getChats = () => API.get("/chats");

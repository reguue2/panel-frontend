import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { listChats, listMessages, sendText, sendTemplate } from "./api";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import "./styles.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("panel_token"));
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  const socket = useMemo(() => io(API_URL, { autoConnect: false }), []);

  useEffect(() => {
    if (!authed) return;
    socket.connect();
    socket.on("message:new", ({ phone }) => {
      refreshChats();
      if (phone === selected) refreshMessages(phone);
    });
    return () => { socket.disconnect(); };
  }, [authed, selected]);

  const refreshChats = async () => {
    const data = await listChats();
    setChats(data);
  };
  const refreshMessages = async (phone) => {
    const data = await listMessages(phone);
    setMessages(data);
  };

  useEffect(() => {
    if (!authed) return;
    refreshChats();
    const int = setInterval(refreshChats, 5000);
    return () => clearInterval(int);
  }, [authed]);

  useEffect(() => {
    if (!authed || !selected) return;
    refreshMessages(selected);
    const int = setInterval(() => refreshMessages(selected), 4000);
    return () => clearInterval(int);
  }, [authed, selected]);

  const handleLogin = (e) => {
    e.preventDefault();
    const token = e.target.token.value.trim();
    if (!token) return;
    localStorage.setItem("panel_token", token);
    setAuthed(true);
  };

  const handleSendText = async (text) => {
    if (!selected || !text.trim()) return;
    await sendText(selected, text);
    await refreshMessages(selected);
  };

  const handleSendTemplate = async ({ name, language, components }) => {
    if (!selected || !name) return;
    await sendTemplate(selected, name, language, components);
    await refreshMessages(selected);
  };

  if (!authed) {
    return (
      <div className="login">
        <form onSubmit={handleLogin} className="login-card">
          <h2>Entrar</h2>
          <p>Introduce tu token del panel</p>
          <input name="token" placeholder="PANEL_TOKEN" />
          <button type="submit">Acceder</button>
        </form>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <ChatList chats={chats} selected={selected} onSelect={setSelected} />
      </aside>
      <main className="main">
        {selected ? (
          <>
            <ChatWindow messages={messages} meLabel="Yo" themLabel="Ellos" />
            <MessageInput onSend={handleSendText} onTemplate={handleSendTemplate} />
          </>
        ) : (
          <div className="placeholder">Selecciona un chat</div>
        )}
      </main>
    </div>
  );
}

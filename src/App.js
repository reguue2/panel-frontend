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
    return () => {
      socket.disconnect();
    };
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

  // Nueva funcion: enviar mensaje a un numero nuevo (chat inexistente)
  const handleSendTextToNew = async (phone, text) => {
    if (!phone || !text) return alert("Completa el numero y el texto");
    await sendText(phone, text);
    await refreshChats();
    setSelected(phone);
    await refreshMessages(phone);
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
          <div className="new-chat">
            <h3>Enviar mensaje nuevo</h3>
            <input
              type="text"
              placeholder="Numero (ej. 346XXXXXXXX)"
              id="newPhone"
              style={{
                width: "80%",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
            <input
              type="text"
              placeholder="Mensaje de texto"
              id="newText"
              style={{
                width: "80%",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
            <button
              onClick={async () => {
                const phone = document.getElementById("newPhone").value.trim();
                const text = document.getElementById("newText").value.trim();
                await handleSendTextToNew(phone, text);
              }}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#128c7e",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Enviar mensaje
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

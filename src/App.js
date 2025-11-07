import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { listChats, listMessages, sendText, sendTemplate } from "./api";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import axios from "axios";
import "./styles.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("panel_token"));
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activePage, setActivePage] = useState("chats");
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const socket = useMemo(() => io(API_URL, { autoConnect: false }), []);

  useEffect(() => {
    if (!authed) return;
    socket.connect();
    socket.on("message:new", ({ phone }) => {
      refreshChats();
      if (phone === selected) refreshMessages(phone);
    });
    return () => socket.disconnect();
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

  // ----------------- LOGIN / LOGOUT -----------------
  const handleLogin = (e) => {
    e.preventDefault();
    const token = e.target.token.value.trim();
    if (!token) return;
    localStorage.setItem("panel_token", token);
    setAuthed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("panel_token");
    window.location.reload();
  };

  // ----------------- ENVÍOS -----------------
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

  const handleSendTextToNew = async (phone, text) => {
    if (!phone || !text) return alert("Completa el numero y el texto");
    await sendText(phone, text);
    await refreshChats();
    setSelected(phone);
    setActivePage("chats");
    await refreshMessages(phone);
  };

  // ----------------- ENVÍO DE PLANTILLAS DESDE FORM -----------------
  const handleSendTemplateNew = async (phone, templateName) => {
    if (!phone || !templateName)
      return alert("Completa el numero y selecciona una plantilla");

    const tpl = document.getElementById("tplName").value;
    const lang = templates.find((t) => t.name === tpl)?.language || "es";

    const headerType = document.getElementById("tplHeaderType").value;
    const headerUrl = (document.getElementById("tplHeaderUrl").value || "").trim();
    const bodyVarsRaw = (document.getElementById("tplBodyVars").value || "").trim();

    const components = [];

    // Header (video / imagen / documento)
    if (headerType !== "none" && headerUrl) {
      components.push({
        type: "header",
        parameters: [
          {
            type: headerType,
            [headerType]: { link: headerUrl },
          },
        ],
      });
    }

    // Variables body
    if (bodyVarsRaw.length > 0) {
      const params = bodyVarsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((txt) => ({ type: "text", text: txt }));
      if (params.length > 0) components.push({ type: "body", parameters: params });
    }

    await sendTemplate(phone, tpl, lang, components);
    alert("Plantilla enviada correctamente");
  };

  // ----------------- CARGAR PLANTILLAS -----------------
  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const panelToken = localStorage.getItem("panel_token");
      const res = await axios.get(`${API_URL}/api/templates`, {
        headers: { "x-api-key": panelToken },
      });
      setTemplates(res.data || []);
    } catch (e) {
      console.error("Error cargando plantillas", e);
      alert("No se pudieron cargar las plantillas. Revisa el backend o tu token.");
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (authed && activePage === "plantilla" && templates.length === 0) {
      loadTemplates();
    }
  }, [authed, activePage]);

  // ----------------- LOGIN SCREEN -----------------
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

  // ----------------- MAIN UI -----------------
  return (
    <div className="layout">
      {/* Menú lateral fijo */}
      <aside className="sidebar-menu">
        <h2 className="menu-title">Panel</h2>
        <button
          className={`menu-btn ${activePage === "chats" ? "active" : ""}`}
          onClick={() => setActivePage("chats")}
        >
          Chats
        </button>
        <button
          className={`menu-btn ${activePage === "plantilla" ? "active" : ""}`}
          onClick={() => setActivePage("plantilla")}
        >
          Enviar plantilla
        </button>
        <button className="menu-btn logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="main">
        {activePage === "chats" && (
          <div className="chats-layout">
            <div className="chats-column">
              <ChatList chats={chats} selected={selected} onSelect={setSelected} />
            </div>

            <div className="chat-window-container">
              {selected ? (
                <>
                  <ChatWindow messages={messages} meLabel="Yo" themLabel="Ellos" />
                  {/* Aquí arreglamos el botón dentro del chat */}
                  <MessageInput
                    onSend={handleSendText}
                    currentChat={selectedChat}
                  />

                </>
              ) : (
                <div className="chat-placeholder">
                  <h3>Selecciona un chat o crea uno nuevo</h3>
                  <input
                    type="text"
                    placeholder="Número (ej. 346XXXXXXXX)"
                    id="newPhone"
                    className="new-input"
                  />
                  <input
                    type="text"
                    placeholder="Mensaje inicial"
                    id="newText"
                    className="new-input"
                  />
                  <button
                    className="new-send-btn"
                    onClick={async () => {
                      const phone = document.getElementById("newPhone").value.trim();
                      const text = document.getElementById("newText").value.trim();
                      await handleSendTextToNew(phone, text);
                    }}
                  >
                    Enviar mensaje
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pestaña de Enviar plantilla */}
        {activePage === "plantilla" && (
          <div className="plantilla-page">
            <h2>Enviar plantilla</h2>
            <button
              className="new-send-btn"
              onClick={loadTemplates}
              style={{ width: "200px", marginBottom: "15px" }}
              disabled={loadingTemplates}
            >
              {loadingTemplates ? "Cargando..." : "Refrescar plantillas"}
            </button>

            {templates.length > 0 ? (
              <>
                <input
                  type="text"
                  placeholder="Número (ej. 346XXXXXXXX)"
                  id="tplPhone"
                  className="new-input"
                />
                <select id="tplName" className="new-input">
                  <option value="">Selecciona plantilla</option>
                  {templates.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.language})
                    </option>
                  ))}
                </select>

                {/* Inputs nuevos para headers y variables */}
                <select id="tplHeaderType" className="new-input">
                  <option value="none">Sin header</option>
                  <option value="image">Header: Imagen</option>
                  <option value="video">Header: Video</option>
                  <option value="document">Header: Documento</option>
                </select>

                <input
                  type="text"
                  placeholder="URL header (https) si aplica"
                  id="tplHeaderUrl"
                  className="new-input"
                />

                <input
                  type="text"
                  placeholder="Variables body separadas por coma (opcional)"
                  id="tplBodyVars"
                  className="new-input"
                />

                <button
                  className="new-send-btn"
                  onClick={async () => {
                    const phone = document.getElementById("tplPhone").value.trim();
                    const tpl = document.getElementById("tplName").value;
                    await handleSendTemplateNew(phone, tpl);
                  }}
                >
                  Enviar plantilla
                </button>
              </>
            ) : (
              <p>No hay plantillas cargadas</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

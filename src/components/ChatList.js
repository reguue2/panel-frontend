import React, { useState } from "react";
import api from "../api.js";

export default function ChatList({ chats, selected, onSelect }) {
  const [filter, setFilter] = useState("all");
  const [loadingPin, setLoadingPin] = useState(null);

  const filteredChats =
    filter === "all"
      ? chats
      : chats.filter((c) =>
          filter === "unread" ? c.has_unread : !c.has_unread
        );

  // Cambiar el estado "pinned" en BD y refrescar visualmente
  const togglePin = async (phone, currentState) => {
    try {
      setLoadingPin(phone);
      await api.patch(`/chats/${phone}/pin`, { pinned: !currentState });
    } catch (err) {
      console.error("Error al fijar chat:", err);
    } finally {
      setLoadingPin(null);
    }
  };

  return (
    <div className="chat-list-container">
      <div
        className="chat-filters"
        style={{ display: "flex", marginBottom: "10px" }}
      >
        <button
          onClick={() => setFilter("unread")}
          style={{
            flex: 1,
            backgroundColor: filter === "unread" ? "#007bff" : "#eee",
            color: filter === "unread" ? "white" : "black",
            border: "none",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          No leídos
        </button>
        <button
          onClick={() => setFilter("read")}
          style={{
            flex: 1,
            backgroundColor: filter === "read" ? "#007bff" : "#eee",
            color: filter === "read" ? "white" : "black",
            border: "none",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          Leídos
        </button>
        <button
          onClick={() => setFilter("all")}
          style={{
            flex: 1,
            backgroundColor: filter === "all" ? "#007bff" : "#eee",
            color: filter === "all" ? "white" : "black",
            border: "none",
            padding: "8px",
            cursor: "pointer",
          }}
        >
          Todos
        </button>
      </div>

      <div className="chat-list">
        {filteredChats.map((c) => {
          const isActive = selected === c.phone;
          const isPinned = c.pinned;

          return (
            <div
              key={c.phone}
              className={`chat-item ${isActive ? "active" : ""} ${
                c.has_unread ? "unread" : ""
              } ${isPinned ? "marked" : ""}`}
              onClick={() => onSelect(c.phone)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "8px",
                borderLeft: isPinned
                  ? "5px solid orange"
                  : "5px solid transparent",
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <div className="chat-title">{c.name || c.phone}</div>
                <div className="chat-preview">{c.last_preview || ""}</div>
                <div className="chat-time">
                  {c.last_timestamp
                    ? new Date(c.last_timestamp * 1000).toLocaleString()
                    : ""}
                </div>
              </div>

              {/* BOTÓN DE FIJAR CHAT */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(c.phone, isPinned);
                }}
                style={{
                  marginLeft: "5px",
                  border: "none",
                  background: isPinned ? "orange" : "#ccc",
                  color: "white",
                  borderRadius: "6px",
                  width: "24px",
                  height: "24px",
                  cursor: loadingPin === c.phone ? "wait" : "pointer",
                  opacity: loadingPin === c.phone ? 0.6 : 1,
                }}
                title={isPinned ? "Desfijar chat" : "Fijar chat"}
              >
                {isPinned ? "✓" : "★"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

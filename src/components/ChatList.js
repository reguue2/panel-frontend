import React, { useState } from "react";

export default function ChatList({ chats, selected, onSelect }) {
  const [filter, setFilter] = useState("all");
  const [markedChats, setMarkedChats] = useState(new Set());

  const filteredChats =
    filter === "all"
      ? chats
      : chats.filter((c) =>
          filter === "unread" ? c.has_unread : !c.has_unread
        );

  const toggleMarked = (phone) => {
    setMarkedChats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phone)) {
        newSet.delete(phone);
      } else {
        newSet.add(phone);
      }
      return newSet;
    });
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
          const isMarked = markedChats.has(c.phone);
          return (
            <div
              key={c.phone}
              className={`chat-item ${isActive ? "active" : ""} ${
                c.has_unread ? "unread" : ""
              }`}
              onClick={() => onSelect(c.phone)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "8px",
                borderLeft: isMarked
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

              {/* BOTÓN DE MARCAR */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // evita abrir el chat al hacer click
                  toggleMarked(c.phone);
                }}
                style={{
                  marginLeft: "5px",
                  border: "none",
                  background: isMarked ? "orange" : "#ccc",
                  color: "white",
                  borderRadius: "6px",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                title={isMarked ? "Desmarcar chat" : "Marcar chat"}
              >
                {isMarked ? "✓" : "★"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

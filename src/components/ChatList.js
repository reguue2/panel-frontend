import React, { useState } from "react";
import "./ChatList.css";

export default function ChatList({ chats, selected, onSelect }) {
  const [filter, setFilter] = useState("all");

  const filteredChats =
    filter === "all"
      ? chats
      : chats.filter((c) =>
          filter === "unread" ? c.has_unread : !c.has_unread
        );


  return (
    <div className="chat-list-container">
      <div className="chat-filters" style={{ display: "flex", marginBottom: "10px" }}>
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
        {filteredChats.map((c) => (
          <div
            key={c.phone}
            className={`chat-item ${selected === c.phone ? "active" : ""} ${
              c.has_unread ? "unread" : ""
            }`}
            onClick={() => onSelect(c.phone)}
          >
            <div className="chat-title">{c.name || c.phone}</div>
            <div className="chat-preview">{c.last_preview || ""}</div>
            <div className="chat-time">
              {c.last_timestamp
                ? new Date(c.last_timestamp * 1000).toLocaleString()
                : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

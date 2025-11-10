import React, { useState } from "react";
import "./ChatList.css";

export default function ChatList({ chats, selected, onSelect }) {
  const [filter, setFilter] = useState("unread");

  const filteredChats = chats.filter(c =>
    filter === "unread" ? c.has_unread : !c.has_unread
  );

  return (
    <div className="chat-list-container">
      <div className="chat-filters">
        <button
          className={filter === "unread" ? "active" : ""}
          onClick={() => setFilter("unread")}
        >
          No leídos
        </button>
        <button
          className={filter === "read" ? "active" : ""}
          onClick={() => setFilter("read")}
        >
          Leídos
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

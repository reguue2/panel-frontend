import React from "react";

export default function ChatList({ chats, onSelect, selectedChat }) {
  const unique = [...new Set(chats.map((m) => m.chat_id))];

  return (
    <div className="chat-list">
      {unique.map((id) => (
        <div
          key={id}
          className={`chat-item ${selectedChat === id ? "active" : ""}`}
          onClick={() => onSelect(id)}
        >
          {id}
        </div>
      ))}
    </div>
  );
}

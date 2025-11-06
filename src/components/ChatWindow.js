import React from "react";

export default function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`message ${m.from_me ? "from-me" : "from-them"}`}
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}

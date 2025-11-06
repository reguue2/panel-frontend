import React, { useState } from "react";

export default function MessageInput({ onSend, onTemplate }) {
  const [text, setText] = useState("");

  const send = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={text}
        placeholder="Escribe un mensaje..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button onClick={send}>Enviar</button>
      <button onClick={onTemplate}>Enviar plantilla</button>
    </div>
  );
}

import { useState } from "react";
import "../styles.css"; 

export default function MessageInput({ onSend, onOpenTemplates }) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const t = text.trim();
    if (!t) return;
    await onSend(t);
    setText("");
  };

  return (
    <div className="message-input-container">
      <input
        type="text"
        className="message-input-field"
        placeholder="Escribe un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="message-button send-button" onClick={handleSend}>
        Enviar
      </button>
      <button className="message-button template-button" onClick={onOpenTemplates}>
        Plantilla
      </button>
    </div>
  );
}

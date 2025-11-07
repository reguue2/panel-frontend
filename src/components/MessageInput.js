import { useState } from "react";

export default function MessageInput({ onSend, onOpenTemplates }) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const t = text.trim();
    if (!t) return;
    await onSend(t);
    setText("");
  };

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ flex: 1 }}
      />
      <button onClick={handleSend}>Enviar</button>
      <button onClick={onOpenTemplates}>Plantilla</button>
    </div>
  );
}

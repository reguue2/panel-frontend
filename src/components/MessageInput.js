import { useState } from "react";

export default function MessageInput({ onSend, currentChat }) {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const t = text.trim();
    if (!t) return;
    await onSend(t);
    setText("");
  };

  const handleGoToTemplates = () => {
    // Redirige a la página de plantillas con el número actual
    if (!currentChat?.phone) {
      alert("No hay un número seleccionado en el chat.");
      return;
    }
    const phone = encodeURIComponent(currentChat.phone);
    window.location.href = `/templates?number=${phone}`;
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
      <button onClick={handleGoToTemplates}>Plantilla</button>
    </div>
  );
}

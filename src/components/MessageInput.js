import { useEffect, useState } from "react";
import { listTemplates } from "../api";

export default function MessageInput({ onSend, onTemplate }) {
  const [text, setText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleSend = async () => {
    const t = text.trim();
    if (!t) return;
    await onSend(t);
    setText("");
  };

  const toggleDropdown = async () => {
    if (!showDropdown) {
      setLoading(true);
      try {
        const data = await listTemplates();
        setTemplates(data || []);
      } catch (err) {
        console.error("Error al cargar plantillas:", err);
      }
      setLoading(false);
    }
    setShowDropdown(!showDropdown);
  };

  const handleSendTemplate = async () => {
    if (!selectedTemplate) return alert("Selecciona una plantilla");
    const tpl = templates.find((t) => t.name === selectedTemplate);
    if (!tpl) return alert("Plantilla no encontrada");
    await onTemplate({
      name: tpl.name,
      language: tpl.language || "es",
      components: [],
    });
    setShowDropdown(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
        <button onClick={toggleDropdown}>Plantilla</button>
      </div>

      {showDropdown && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            background: "#f5f5f5",
            padding: "6px",
            borderRadius: "6px",
          }}
        >
          {loading ? (
            <span>Cargando plantillas...</span>
          ) : (
            <>
              <select
                style={{ flex: 1 }}
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Selecciona una plantilla...</option>
                {templates.map((tpl) => (
                  <option key={tpl.name} value={tpl.name}>
                    {tpl.name} ({tpl.language})
                  </option>
                ))}
              </select>
              <button onClick={handleSendTemplate}>Enviar plantilla</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

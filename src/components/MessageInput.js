import { useEffect, useState } from "react";
import { listTemplates } from "../api";

export default function MessageInput({ onSend, onTemplate }) {
  const [text, setText] = useState("");
  const [tplOpen, setTplOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTpls, setLoadingTpls] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    await onSend(t);
    setText("");
  };

  const toggleTemplates = () => {
    setTplOpen(s => !s);
  };

  useEffect(() => {
    const fetchTpls = async () => {
      try {
        setLoadingTpls(true);
        const tpls = await listTemplates();
        setTemplates(tpls || []);
        if ((tpls || []).length > 0) setSelectedIdx(0);
      } catch (e) {
        console.error(e);
        setTemplates([]);
      } finally {
        setLoadingTpls(false);
      }
    };
    if (tplOpen && templates.length === 0) fetchTpls();
    // solo cuando se abre
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tplOpen]);

  const sendTpl = async () => {
    if (selectedIdx < 0 || selectedIdx >= templates.length) return;
    const chosen = templates[selectedIdx];
    await onTemplate({
      name: chosen.name,
      language: chosen.language || "es",
      components: [],
    });
    setTplOpen(false);
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button onClick={send}>Enviar</button>
      <button onClick={toggleTemplates}>Plantilla</button>

      {tplOpen && (
        <div className="template-panel">
          {loadingTpls ? (
            <div>Cargando plantillas...</div>
          ) : templates.length === 0 ? (
            <div>No hay plantillas</div>
          ) : (
            <>
              <select
                value={selectedIdx}
                onChange={(e) => setSelectedIdx(parseInt(e.target.value, 10))}
              >
                {templates.map((t, idx) => (
                  <option key={`${t.name}-${idx}`} value={idx}>
                    {t.name} ({t.language})
                  </option>
                ))}
              </select>
              <button onClick={sendTpl}>Enviar plantilla</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

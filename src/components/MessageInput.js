import { useState } from "react";

export default function MessageInput({ onSend, onTemplate }) {
  const [text, setText] = useState("");
  const [tplOpen, setTplOpen] = useState(false);
  const [tplName, setTplName] = useState("");
  const [tplLang, setTplLang] = useState("es");

  const send = async () => {
    if (!text.trim()) return;
    await onSend(text.trim());
    setText("");
  };

  const sendTpl = async () => {
    if (!tplName.trim()) return;
    await onTemplate({ name: tplName.trim(), language: tplLang, components: [] });
    setTplName("");
    setTplOpen(false);
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
      <button onClick={() => setTplOpen(s => !s)}>Plantilla</button>
      {tplOpen && (
        <div className="template-panel">
          <input placeholder="Nombre de plantilla" value={tplName} onChange={(e)=>setTplName(e.target.value)} />
          <input placeholder="Idioma (es)" value={tplLang} onChange={(e)=>setTplLang(e.target.value)} />
          <button onClick={sendTpl}>Enviar plantilla</button>
        </div>
      )}
    </div>
  );
}

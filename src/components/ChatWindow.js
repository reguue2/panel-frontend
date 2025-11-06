export default function ChatWindow({ messages, meLabel="Yo", themLabel="Ellos" }) {
  return (
    <div className="chat-window">
      {messages.map((m) => (
        <div key={m.id} className={`msg-row ${m.direction === "out" ? "me" : "them"}`}>
          <div className="bubble">
            <div className="text">{m.text || (m.template_name ? `Plantilla: ${m.template_name}` : "")}</div>
            <div className="time">{new Date(m.timestamp*1000).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatWindow({ messages, meLabel = "Yo", themLabel = "Ellos" }) {
  return (
    <div className="chat-window">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`msg-row ${m.direction === "out" ? "me" : "them"}`}
        >
          <div className="bubble">
            {m.type === "audio" && m.media_url ? (
              <audio
                controls
                preload="metadata"
                style={{ width: "100%" }}
                src={m.media_url}
                onError={(e) => {
                  console.warn("Fallo al cargar audio:", m.media_url, e?.target?.error);
                }}
              />
            ) : (
              <div className="text">
                {m.text || (m.template_name ? `Plantilla: ${m.template_name}` : "")}
              </div>
            )}
            <div className="time">
              {new Date(m.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

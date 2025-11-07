export default function ChatWindow({ messages, meLabel = "Yo", themLabel = "Ellos" }) {
  return (
    <div className="chat-window">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`msg-row ${m.direction === "out" ? "me" : "them"}`}
        >
          <div className="bubble">
            {/* Mostrar audio si el mensaje es de tipo "audio" */}
            {m.type === "audio" && m.media_url ? (
              <audio
                controls
                preload="none"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  outline: "none",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <source src={m.media_url} type="audio/ogg" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            ) : (
              <div className="text">
                {m.text ||
                  (m.template_name ? `Plantilla: ${m.template_name}` : "")}
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

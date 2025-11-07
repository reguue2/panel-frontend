import React from "react";

export default function ChatWindow({ messages, meLabel = "Yo", themLabel = "Ellos" }) {
  return (
    <div className="chat-window">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`msg-row ${m.direction === "out" ? "me" : "them"}`}
        >
          <div className="bubble">
            {/* --- AUDIO --- */}
            {m.type === "audio" && m.media_url ? (
              <audio
                controls
                preload="metadata"
                style={{
                  width: "100%",
                  outline: "none",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                }}
                src={m.media_url.startsWith("http")
                  ? m.media_url
                  : `${process.env.REACT_APP_API_URL}${m.media_url}`}
                onError={(e) => {
                  console.warn("Error cargando audio:", m.media_url, e);
                  e.target.outerHTML =
                    '<div style="color:#999">Audio no disponible</div>';
                }}
              />
            ) : m.type === "image" && m.media_url ? (
              /* --- IMAGEN --- */
              <img
                src={
                  m.media_url.startsWith("http")
                    ? m.media_url
                    : `${process.env.REACT_APP_API_URL}${m.media_url}`
                }
                alt="imagen"
                style={{ maxWidth: "60%", borderRadius: "8px" }}
              />
            ) : m.type === "document" && m.media_url ? (
              /* --- DOCUMENTO --- */
              <a
                href={
                  m.media_url.startsWith("http")
                    ? m.media_url
                    : `${process.env.REACT_APP_API_URL}${m.media_url}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar documento
              </a>
            ) : (
              /* --- TEXTO o PLANTILLA --- */
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

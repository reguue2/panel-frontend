export default function ChatList({ chats, selected, onSelect }) {
  return (
    <div className="chat-list">
      {chats.map((c) => (
        <div
          key={c.phone}
          className={`chat-item ${selected === c.phone ? "active" : ""}`}
          onClick={() => onSelect(c.phone)}
        >
          <div className="chat-title">{c.name || c.phone}</div>
          <div className="chat-preview">{c.last_preview || ""}</div>
          <div className="chat-time">{c.last_timestamp ? new Date(c.last_timestamp*1000).toLocaleString() : ""}</div>
        </div>
      ))}
    </div>
  );
}

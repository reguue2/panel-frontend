import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { getChats, sendMessage, sendTemplate } from "./api";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import "./styles.css";

const socket = io(process.env.REACT_APP_API_URL);

export default function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    loadChats();
    socket.on("newMessage", (msg) => {
      setChats((prev) => [...prev, msg]);
    });
  }, []);

  async function loadChats() {
    const { data } = await getChats();
    setChats(data);
  }

  const currentMessages = selectedChat
    ? chats.filter((m) => m.chat_id === selectedChat)
    : [];

  async function handleSend(text) {
    await sendMessage(selectedChat, text);
  }

  async function handleTemplate() {
    const name = prompt("Nombre de la plantilla:");
    if (!name) return;
    await sendTemplate(selectedChat, name);
  }

  return (
    <div className="app">
      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        onSelect={setSelectedChat}
      />
      <div className="chat-container">
        {selectedChat ? (
          <>
            <ChatWindow messages={currentMessages} />
            <MessageInput
              onSend={handleSend}
              onTemplate={handleTemplate}
            />
          </>
        ) : (
          <div className="placeholder">Selecciona un chat</div>
        )}
      </div>
    </div>
  );
}

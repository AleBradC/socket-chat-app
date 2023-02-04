import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import "./App.css";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleSendMesg = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_msg", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_msg", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p> {messageContent.message} </p>
                  </div>
                  <div className="message-meta">
                    <p className="time">{messageContent.time} </p>
                    <p className="author"> {messageContent.author} </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyDown={(event) => {
            event.key === "Enter" && handleSendMesg();
          }}
          placeholder="Type something here"
        />
        <button onClick={handleSendMesg}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;

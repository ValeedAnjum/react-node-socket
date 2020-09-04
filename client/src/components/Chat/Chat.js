import React, { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";

import InfoBar from "../InforBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
let socket;
const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "https://react-node-socket.herokuapp.com/";
  useEffect(() => {
    const { Name, Room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setName(Name);
    setRoom(Room);
    socket.emit("join", { name: Name, room: Room }, () => {
      // console.log("red");
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  console.log(messages);
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          sendMessage={sendMessage}
          setMessage={setMessage}
          message={message}
        />
      </div>
    </div>
  );
};

export default Chat;

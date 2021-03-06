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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const ENDPOINT = "https://react-node-socket.herokuapp.com/";
  const ENDPOINT = "http://localhost:5000/";
  useEffect(() => {
    const { Name, Room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setName(Name);
    setRoom(Room);
    socket.emit("join", { name: Name, room: Room }, () => {
      // console.log("red");
    });

    return () => {
      console.log("disconnect");
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      // console.log("mgs", messages);
      // console.log("m", message);
      setMessages((msg) => [...msg, message]);
      // console.log("mgs", messages);
    });
  }, []);
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  const handleUserMedia = () => {
    let file = document.querySelector("input[type=file]").files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setMessage(reader.result);
      console.log("se");
    };
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
        <input type="file" name="user-media" onChange={handleUserMedia} />
      </div>
    </div>
  );
};

export default Chat;

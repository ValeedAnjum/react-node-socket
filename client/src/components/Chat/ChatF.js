import React, { Component } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";

import InfoBar from "../InforBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
let socket;
const ENDPOINT = "http://localhost:5000/";
class Chat extends Component {
  state = {
    name: "",
    room: "",
    message: "",
    messages: [],
  };
  componentDidMount() {
    const { Name, Room } = queryString.parse(this.props.location.search);
    socket = io(ENDPOINT);
    this.setState({ ...this.state, name: Name, room: Room });
    socket.emit("join", { name: Name, room: Room }, () => {
      console.log("red");
    });
    socket.on("message", (message) => {
      const oldState = { ...this.state };
      console.log(oldState.messages);
      oldState.messages.push(message);
      this.setState(oldState);
      console.log(oldState.messages);
    });
  }
  componentWillUnmount() {
    console.log("disconnect");
    socket.emit("disconnect");
    socket.off();
  }
  sendMessage = (event) => {
    event.preventDefault();
    if (this.state.message) {
      socket.emit("sendMessage", this.state.message, () => {
        this.setState({ ...this.state, message: "" });
      });
    }
  };
  setMessage = (message) => {
    this.setState({ ...this.state, message: message });
  };
  render() {
    return (
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={this.state.room} />
          <Messages messages={this.state.messages} name={this.state.name} />
          <Input
            sendMessage={this.sendMessage}
            setMessage={this.setMessage}
            message={this.state.message}
          />
          <input type="file" name="user-media" />
        </div>
      </div>
    );
  }
}

export default Chat;

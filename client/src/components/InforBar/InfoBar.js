import React from "react";
import { Link } from "react-router-dom";

import onlineIcon from "../../icons/onlineIcon.png";
import closeIcon from "../../icons/closeIcon.png";

import "./InfoBar.css";

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} />
      {room}
    </div>
    <div className="rightInnerContainer">
      <Link to="/">
        <img src={closeIcon} />
      </Link>
    </div>
  </div>
);

export default InfoBar;

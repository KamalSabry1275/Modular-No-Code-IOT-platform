import React, { useEffect, useState } from "react";
import { socket } from "../../socket";

export function ConnectionManager() {
  const [isConnect, setIsConnect] = useState(false);

  socket.on("connect", () => {
    setIsConnect(true);
  });

  socket.on("disconnect", () => {
    setIsConnect(false);
  });

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  function connectState() {
    if (!isConnect) {
      connect();
    } else {
      disconnect();
    }
  }

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <button
        className="text_color"
        style={{ fontWeight: "400", background: "none", border: "none" }}
        onClick={connectState}
      >
        {isConnect ? "Disconnect to socketIO" : "Connect to socketIO"}
      </button>
      <div className="blob">
        <div className="pulse"></div>
      </div>
    </div>
  );
}

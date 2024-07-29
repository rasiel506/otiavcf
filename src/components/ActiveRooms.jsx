// ActiveRooms.jsx

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const ActiveRooms = () => {
  const [rooms, setRooms] = useState([]);
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect(process.env.REACT_APP_SOCKET_URL || "https://otiavcb-production.up.railway.app/");
    
    socket.current.on("active rooms", (rooms) => {
      setRooms(rooms);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Active Rooms</h1>
      <ul>
        {rooms.map((roomID) => (
          <li key={roomID}>
            <Link to={`/room/${roomID}`}>{roomID}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveRooms;

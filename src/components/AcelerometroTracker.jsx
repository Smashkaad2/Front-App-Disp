import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Conéctate al servidor WebSocket
//const socket = io("http://localhost:3000");

const AcelerometroTracker = () => {
  const [accelerometerData, setAccelerometerData] = useState({
    x: null,
    y: null,
    z: null,
  });

  useEffect(() => {
    const handleMotion = (event) => {
      const data = {
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z,
      };

      setAccelerometerData(data);

      // Enviar por WebSockets
      //*socket.emit("accelerometerData", data);

      // Enviar por REST
      /*fetch("http://localhost:3000/acelerometro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch((error) => console.error("Error enviando datos de acelerómetro:", error));*/
    };

    window.addEventListener("devicemotion", handleMotion);

    // Escuchar eventos del servidor WebSocket
    /*socket.on("accelerometerUpdate", (data) => {
      setAccelerometerData(data);
    });

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      socket.off("accelerometerUpdate");
    };*/
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold">Acelerómetro</h3>
      <p>X: {accelerometerData.x}</p>
      <p>Y: {accelerometerData.y}</p>
      <p>Z: {accelerometerData.z}</p>
    </div>
  );
};

export default AcelerometroTracker;

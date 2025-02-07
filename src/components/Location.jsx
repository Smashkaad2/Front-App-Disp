import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [latencies, setLatencies] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [serverUrl, setServerUrl] = useState("http://localhost:3000");
  const [pingResults, setPingResults] = useState([]); 
  const primaryServerUrl = "http://localhost:3000";
  const replicaServerUrl = "http://localhost:3001";

 
  const pingServer = async (url) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const socket = io(url, { timeout: 3000, autoConnect: false });

      socket.on("connect", () => {
        const latencyTime = Date.now() - startTime;
        setPingResults((prev) => [
          ...prev,
          { server: url, status: "Activo", latency: latencyTime },
        ]);
        resolve(true);
        socket.disconnect();
      });

      socket.on("connect_error", () => {
        setPingResults((prev) => [
          ...prev,
          { server: url, status: "Caído", latency: "N/A" },
        ]);
        resolve(false);
      });

      socket.connect();
    });
  };

  useEffect(() => {
    const checkServerAvailability = async () => {
      setPingResults([]); // Reinicia la lista de pings en cada verificación

      const primaryServerAvailable = await pingServer(primaryServerUrl);
      const replicaServerAvailable = await pingServer(replicaServerUrl);

      if (primaryServerAvailable && replicaServerAvailable) {
        setError(null);
        return;
      }

      if (!primaryServerAvailable && replicaServerAvailable) {
        setError("El servidor principal no está disponible, se conectará al servidor replica.");
        setServerUrl(replicaServerUrl);
        return;
      }

      if (primaryServerAvailable && !replicaServerAvailable) {
        setError("El servidor replica no está disponible, se conectará al servidor principal.");
        setServerUrl(primaryServerUrl);
        return;
      }

      setError("Ambos servidores están caídos.");
    };

    checkServerAvailability(); // Verificar servidores al inicio

    const socket = io(serverUrl, {
      reconnectionAttempts: 3, // Intenta reconectar 3 veces antes de fallar
    });

    socket.on("connect", () => {
      setError(null);
    });

    socket.on("connect_error", async () => {
      console.log(`No se pudo conectar a ${serverUrl}, intentando con el otro servidor...`);
      const newServerUrl = serverUrl === primaryServerUrl ? replicaServerUrl : primaryServerUrl;
      setServerUrl(newServerUrl);
    });

    const getRandomLocation = (lat, lon) => {
      const latVariation = (Math.random() - 0.5) * 0.001;
      const lonVariation = (Math.random() - 0.5) * 0.001;
      return {
        latitude: lat + latVariation,
        longitude: lon + lonVariation,
      };
    };

    const sendLocationData = (latitude, longitude) => {
      const startTime = Date.now();

      const locationData = getRandomLocation(latitude, longitude);

      socket.emit("sendLocation", locationData);

      socket.once("locationUpdate", (data) => {
        const latencyTime = Date.now() - startTime;
        setLocation(data);
        setLatency(latencyTime);
        setLatencies((prevLatencies) => [...prevLatencies, latencyTime]);

        if (isRunning) {
          sendLocationData(data.latitude, data.longitude);
        }
      });
    };

    if (isRunning) {
      sendLocationData(40.7128, -74.006);
    }

    return () => {
      socket.off("locationUpdate");
      socket.disconnect();
    };
  }, [isRunning, serverUrl]);

  return (
    <div>
      <h1>Ubicación en tiempo real</h1>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <h2>Estado de Servidores</h2>
      <ul>
        {pingResults.map((result, index) => (
          <li key={index}>
            {result.server} → {result.status} {result.latency !== "N/A" && `(${result.latency} ms)`}
          </li>
        ))}
      </ul>

      {location ? (
        <p>
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </p>
      ) : (
        <p> Cargando ubicación...</p>
      )}

      {latency !== null && <p> Latencia actual: {latency} ms</p>}

      {!isRunning && <h3> Latencias registradas:</h3>}
    </div>
  );
};

export default Location;

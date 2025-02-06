import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

//const socket = io('http://localhost:3000'); // Conectar con el servidor WebSocket

const GiroscopioTracker = () => {
  const [gyroscopeData, setGyroscopeData] = useState({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    const handleOrientation = (event) => {
      const gyroscopeValues = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      };

      setGyroscopeData(gyroscopeValues);

      // Enviar los datos al servidor WebSocket
      //socket.emit('gyroscopeData', gyroscopeValues);

      // Enviar los datos al backend usando REST
      /*fetch('http://localhost:3000/giroscopio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gyroscopeValues),
      }).catch((error) => console.error('Error enviando datos de giroscopio:', error));
      */
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Escuchar actualizaciones del servidor vía WebSockets
  /*useEffect(() => {
    socket.on('gyroscopeUpdate', (data) => {
      setGyroscopeData(data);
    });

    return () => {
      socket.off('gyroscopeUpdate');
    };
  }, []);*/

  return (
    <div>
      <h3 className='text-xl font-bold'>Giroscopio</h3>
      <p>Alpha (Rotación en Z): {gyroscopeData.alpha}</p>
      <p>Beta (Rotación en X): {gyroscopeData.beta}</p>
      <p>Gamma (Rotación en Y): {gyroscopeData.gamma}</p>
    </div>
  );
};

export default GiroscopioTracker;

import React from "react";
import AcelerometroTracker from "./AcelerometroTracker";
import GeolocationTracker from "./GeolocationTracker";
import GiroscopioTracker from "./GiroscopioTracker";

const SensorTracker = () => {
    return (
    <div>
      <h2 className="text-2xl text-green-500 font-bold">Datos de los Sensores</h2>
      <AcelerometroTracker />
      <GeolocationTracker />
      <GiroscopioTracker />
    </div>
  );
};

export default SensorTracker;
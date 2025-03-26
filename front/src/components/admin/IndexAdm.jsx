import React, { useEffect, useState } from "react";
import CardInfo from "./CardInfo";
import Metricas from "./Metricas";
import { useParams } from "react-router-dom";
import { getSucursalId } from "../queris/queris";

const IndexAdm = () => {
  const [sede, setSede] = useState({});
  const [pause, setPause] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    setPause(true);
    getSucursalId(id).then((data) => {
      console.log(data);
      setPause(false);
      setSede(data);
    });
  }, []);

  return (
    <div>
      {pause ? (
        <svg fill="black" className="w-6 h-6 mx-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
            <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" />
          </path>
        </svg>
      ) : (
        <h1 className="text-center text-2xl font-bold principal">Información de {sede.name}</h1>
      )}
      <CardInfo sede={sede}></CardInfo>
      <Metricas sede={sede}></Metricas>
    </div>
  );
};

export default IndexAdm;

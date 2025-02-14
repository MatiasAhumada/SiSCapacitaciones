import React, { useEffect, useState } from "react";
import CardInfo from "./CardInfo";
import Metricas from "./Metricas";
import { useParams } from "react-router-dom";

const IndexAdm = () => {
  const [sede, setSede] = useState({});
  const { id } = useParams();
  const sedes = {
    id: 1,
    nombre: "Sede Santiago",
    profesores: "Calle 1",
    vendedores: "123456",
    alumnos: 2,
    comAct: 4,
  };
  useEffect(() => {
    //Aqui buscara la sede y sus datos por id
    console.log(id);
    setSede(sedes);
  }, []);
  return (
    <div>
      <h1 className="text-center text-2xl font-bold">Información de {sede.nombre}</h1>

      <CardInfo sede={sede}></CardInfo>
      <Metricas sede={sede}></Metricas>
    </div>
  );
};

export default IndexAdm;

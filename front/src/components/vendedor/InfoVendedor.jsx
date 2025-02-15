import React from "react";
import { useLocation } from "react-router-dom";

const InfoVendedor = () => {
  const location = useLocation();
  const { id } = location.state || {};
  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
};

export default InfoVendedor;

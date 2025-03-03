import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getSucursalId } from "../queris/queris";

const CardInfo = () => {
  const { id } = useParams();
  const [sucursal, setSucursal] = useState({});
  useEffect(() => {
    getSucursalId(id).then((data) => {
    
      setSucursal(data || {});
    });
  }, []);

  return (
    <Row>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Profes</h4>
          <p className="mt-2 text-center">{sucursal.profesores?.length ||0}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Alumnos</h4>
          <p className="mt-2 text-center">{sucursal.alumnos?.length ||0}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Vendedores</h4>
          <p className="mt-2 text-center">{sucursal.vendedores?.length ||0}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Comisiones activas</h4>
          <p className="mt-2 text-center">{sucursal.comisiones?.length ||0}</p>
        </div>
      </Col>
    </Row>
  );
};

export default CardInfo;

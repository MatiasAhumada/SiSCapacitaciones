import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const CardInfo = ({ sede }) => {

  return (
    <Row>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Profes</h4>
          <p className="mt-2 text-center">{sede.profesores?.length}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Alumnos</h4>
          <p className="mt-2 text-center">{sede.alumnos?.length}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Vendedores</h4>
          <p className="mt-2 text-center">{sede.vendedores?.length}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Comisiones activas</h4>
          <p className="mt-2 text-center">{sede.comisiones?.length}</p>
        </div>
      </Col>
    </Row>
  );
};

export default CardInfo;

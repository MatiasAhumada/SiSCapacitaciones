import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CardInfo = ({ sede }) => {
  return (
    <Row>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Profes</h4>
          <p className="mt-2 text-center">{sede.profesorComisiones}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Alumnos</h4>
          <p className="mt-2 text-center">{sede.alumnos}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Vendedores</h4>
          <p className="mt-2 text-center">{sede.vendedores}</p>
        </div>
      </Col>
      <Col lg={3} sm={6} xs={12}>
        <div className="btnAz m-2">
          <h4 className="principal text-center">Comisiones activas</h4>
          <p className="mt-2 text-center">{sede.comisiones}</p>
        </div>
      </Col>
    </Row>
  );
};

CardInfo.propTypes = {
  sede: PropTypes.shape({
    profesorComisiones: PropTypes.number,
    alumnos: PropTypes.number,
    vendedores: PropTypes.number,
    comisiones: PropTypes.number,
  }).isRequired,
};

export default CardInfo;

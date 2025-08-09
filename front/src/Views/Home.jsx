import { useEffect, useState } from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getSucursales } from '../components/queris/queris';

const Home = () => {
  const navigate = useNavigate();
  const [pause, setPause] = useState(false);
  const handleClick = (id) => {
    navigate(`/adm/${id}`);
  };
  const [sedes, setSedes] = useState([]);
  useEffect(() => {
    setPause(true);
    getSucursales().then((data) => {
      setPause(false);
      setSedes(data);
    });
  }, []);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      {pause ? (
        <svg
          fill="black"
          className="w-6 h-6 mx-auto"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              dur="0.75s"
              values="0 12 12;360 12 12"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      ) : (
        <Row className="justify-content-center">
          {sedes.map((sede) => (
            <Col key={sede.id} lg={4} sm={6} xs={12} className="d-flex justify-content-center">
              <Card
                style={{ width: '18rem', cursor: 'pointer' }}
                className="m-3 text-center"
                onClick={() => handleClick(sede.id)}
              >
                <Card.Body>
                  <Card.Title className="mb-3">{sede.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    Profesores: {sede.profesores}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-3 text-muted">
                    Vendedores: {sede.vendedores}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-3 text-muted">Alumnos: {sede.alumnos}</Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getSucursales } from '../components/queris/queris';
import { Spinner } from '../components/Spinner/Spinner'

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
        <Spinner />
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

import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/adm/${id}`);
  };
  const sedes = [
    { id: 1, title: "Sede Santiago", profesores: 5, vendedores: 3, alumnos: 200 },
    { id: 2, title: "Sede Centro", profesores: 5, vendedores: 3, alumnos: 200 },
    { id: 3, title: "Sede Tafi Viejo", profesores: 5, vendedores: 3, alumnos: 200 },
  ];
 
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        {sedes.map((sede) => (
          <Col key={sede.id} lg={4} sm={6} xs={12} className="d-flex justify-content-center">
            <Card style={{ width: "18rem", cursor: "pointer" }} className="m-3 text-center" onClick={() => handleClick(sede.id)}>
              <Card.Body>
                <Card.Title className="mb-3">{sede.title}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted">Profesores: {sede.profesores}</Card.Subtitle>
                <Card.Subtitle className="mb-3 text-muted">Vendedores: {sede.vendedores}</Card.Subtitle>
                <Card.Subtitle className="mb-3 text-muted">Alumnos: {sede.alumnos}</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;

import { Row, Col, Card, Button, Container } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col lg={4} sm={4} xs={12} className="d-flex justify-content-center">
          <Card style={{ width: "18rem" }} className="m-3 text-center">
            <Card.Body>
              <Card.Title className="mb-3">Sede Santiago</Card.Title>

              <Card.Subtitle className="mb-3 text-muted">Profesores: 5</Card.Subtitle>
              <Card.Subtitle className="mb-3 text-muted">Vendedores: 3</Card.Subtitle>
              <Card.Subtitle className="mb-3 text-muted">Alumnos: 200</Card.Subtitle>

              <div className="mt-4">
                <Button variant="primary">Ingresar</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} sm={4} xs={12} className="d-flex justify-content-center">
          <Card style={{ width: "18rem" }} className="m-3 text-center">
            <Card.Body>
              <Card.Title className="mb-3">Sede Centro</Card.Title>

              <Card.Subtitle className="mb-3 text-muted">Profesores: 5</Card.Subtitle>
              <Card.Subtitle className="mb-3 text-muted">Vendedores: 3</Card.Subtitle>
              <Card.Subtitle className="mb-3 text-muted">Alumnos: 200</Card.Subtitle>

              <div className="mt-4">
                <Button variant="primary">Ingresar</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} sm={4} xs={12} className="d-flex justify-content-center">
          <Card style={{ width: "18rem" }} className="m-3 text-center">
            <Card.Body>
              <Card.Title className="mb-3">Sede Tafi Viejo</Card.Title>

              <Card.Subtitle className="mb-3 text-muted">Profesores: 5</Card.Subtitle>
              <Card.Subtitle className="mb-3 text-muted">Vendedores: 3</Card.Subtitle>
              <Card.Subtitle className="mb-3 text-muted">Alumnos: 200</Card.Subtitle>

              <div className="mt-4">
                <Button variant="primary">Ingresar</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

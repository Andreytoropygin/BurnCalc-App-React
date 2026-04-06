import type { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { Button, Container, Row, Col } from "react-bootstrap";
import { BreadCrumbs } from "../components/BreadCrumbs";
import "./HomePage.css"

export const HomePage: FC = () => (
  <Container className="py-4">
    <BreadCrumbs crumbs={[]} />
    
    <Row className="justify-content-center">
      <Col md={8} lg={7} className="text-center mt-4">
        <h1>Добро пожаловать в BurnCalc</h1>
        <p className="my-4">
          Калькулятор сгорания простейших органических соединений. 
          Выберите соединение из каталога, чтобы увидеть данные о продуктах реакции.
        </p>
        <Link to={ROUTES.LIST}>
          <Button variant="outline-dark" size="lg">Перейти к каталогу</Button>
        </Link>
      </Col>
    </Row>
  </Container>
);

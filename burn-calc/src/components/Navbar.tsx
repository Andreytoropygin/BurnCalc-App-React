import type { FC } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import "./Navbar.css"

export const AppNavbar: FC = () => {
  return (
    <Navbar className="custom-navbar" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.HOME} className="d-flex align-items-center gap-2">
          <span className="logo-icon">BC</span>
          <span className="logo-text">BurnCalc</span>
        </Navbar.Brand>
        
        <Nav className="ms-auto">
          <Nav.Link as={Link} to={ROUTES.HOME} className="nav-link-custom">
            Главная
          </Nav.Link>
          <Nav.Link as={Link} to={ROUTES.LIST} className="nav-link-custom">
            Соединения
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
import { useState, type FC } from "react";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { clearUser } from '../slices/userSlice';
import { Api } from '../api/axios';
import "./Navbar.css"

export const AppNavbar: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await Api.post('api/users/logout');
      dispatch(clearUser());
      navigate(ROUTES.COMPOUNDS_LIST);
    } catch (e) {
      console.warn('Ошибка при logout на сервере');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Navbar className="custom-navbar" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.COMPOUNDS_LIST} className="d-flex align-items-center gap-2">
          <span className="logo-icon">BC</span>
          <span className="logo-text">BurnCalc</span>
        </Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROUTES.COMPOUNDS_LIST} className="nav-link-custom">
              Соединения
            </Nav.Link>
            {user.name !== null && (
              <Nav.Link as={Link} to={ROUTES.COMBUSTIONS_LIST} className="nav-link-custom">
                Заявки
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {user.name === null ? (
              // Кнопка для гостя
              <Button 
                href={ROUTES.LOGIN} 
                variant="outline-light" 
                size="sm"
              >
                Войти
              </Button>
            ) : (
              // Блок для авторизованного пользователя
              <div className="d-flex align-items-center gap-2">
                <div className="text-white text-end d-flex flex-column align-items-end">
                  <div className="d-flex align-items-center gap-2">
                    <div className="fw-bold small">
                      {user.name}
                    </div>
                    {user.isExpert && (
                      <Badge bg="warning" text="dark" style={{ fontSize: '0.7em' }}>
                        Эксперт
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Выход'}
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

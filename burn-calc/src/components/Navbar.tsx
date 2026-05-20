import { useEffect, useState, type FC } from "react";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap";
import { ROUTES } from "../Routes";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery } from "../slices/filterSlice";
import { resetDraftWidget } from "../slices/draftWidgetSlice";
import type { AppDispatch, RootState } from '../store';
import { clearUser } from '../slices/userSlice';
import { Axios } from '../api/Axios';
import "./Navbar.css"

export const AppNavbar: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await Axios.post('api/users/logout');
      dispatch(clearUser());
      navigate(ROUTES.COMPOUNDS_LIST);
    } catch (e) {
      console.warn('Ошибка при logout на сервере');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.name == null) {
      dispatch(setQuery(""));
      dispatch(resetDraftWidget());
    }
  }, [user.name, dispatch]);

  return (
    <Navbar className="custom-navbar" expand="md" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={ROUTES.COMPOUNDS_LIST} className="d-flex align-items-center gap-2">
          <span className="logo-icon">BC</span>
          <span className="logo-text">BurnCalc</span>
        </Navbar.Brand>

        {/* Кнопка бургера, которая появится на экранах меньше 768px*/}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto me-md-auto text-end text-md-start">
            <Nav.Link as={Link} to={ROUTES.COMPOUNDS_LIST} className="nav-link-custom">
              Соединения
            </Nav.Link>
            {user.name !== null && (
              <Nav.Link as={Link} to={ROUTES.COMBUSTIONS_LIST} className="nav-link-custom">
                Заявки
              </Nav.Link>
            )}
          </Nav>

          <div className="d-none align-items-center justify-content-end gap-3 w-100 pb-3 pb-lg-0">
            {user.name === null ? (
              // Кнопка для гостя
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline-light" size="sm">
                  Войти
                </Button>
              </Link>
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

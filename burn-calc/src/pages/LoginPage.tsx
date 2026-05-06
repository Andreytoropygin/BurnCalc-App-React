import type { FC } from 'react';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { setUser } from '../slices/userSlice';
import { Api } from '../api/axios';
import { ROUTES } from '../Routes';

export const LoginPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const identified_name = useSelector((state: RootState) => state.user.name);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (identified_name !== null) {
      navigate(ROUTES.COMPOUNDS_LIST);
    }
  }, [identified_name]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await Api.post('api/users/login', { name, password });
      dispatch(setUser({ user: response.data }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Header className="bg-primary text-white text-center">
          <h4 className="mb-0">Вход в BurnCalc</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={3}
                required
                disabled={isLoading}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                disabled={isLoading}
              />
            </Form.Group>
            <Button type="submit" className="w-100 my-btn" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <span className="text-muted">Нет аккаунта? </span>
            <Link to={ROUTES.REGISTER}>Зарегистрироваться</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

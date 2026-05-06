import type { FC, SyntheticEvent } from 'react';
import { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState } from '../store';
import { Api } from '../api/axios';
import { ROUTES } from '../Routes';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const identified_name = useSelector((state: RootState) => state.user.name);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (identified_name !== null) {
    navigate(ROUTES.COMPOUNDS_LIST);
    return null;
  }

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await Api.post('api/users/register', { name, password });
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Header className="bg-success text-white text-center">
          <h4 className="mb-0">Регистрация</h4>
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
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <span className="text-muted">Уже есть аккаунт? </span>
            <Link to={ROUTES.LOGIN}>Войти</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};
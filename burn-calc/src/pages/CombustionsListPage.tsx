import type { FC } from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, Form, Button, Spinner, Alert, Container, Badge, Row, Col, Card 
} from "react-bootstrap";
import type { AppDispatch, RootState } from "../store";
import { 
  fetchCombustionsList, 
  setFilters, 
  resetFilters, 
  completeCombustion 
} from "../slices/combustionsListSlice";
import { ROUTE_LABELS, ROUTES } from "../Routes";
import { useNavigate } from "react-router-dom";
import { BreadCrumbs } from "../components/BreadCrumbs";
import type { CompleteCombustionDto } from "../api/Api";
import "./CombustionsListPage.css"

export const CombustionsListPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { items, isLoading, error, filters } = useSelector((state: RootState) => state.combustionsList);
  const user = useSelector((state: RootState) => state.user);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    dispatch(fetchCombustionsList(filters));
  }, [dispatch]);

  // Short polling только для экспертов
  useEffect(() => {
    if (user.isExpert) {
      pollingRef.current = setInterval(() => {
        dispatch(fetchCombustionsList(filters));
      }, 5000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user, filters, dispatch]);

  const filteredItems = items.filter(item => {
    if (!filters.creatorName) return true;
    return item.technicianName.toLowerCase().includes(filters.creatorName.toLowerCase());
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  // Эффект для перезагрузки при изменении фильтров
  useEffect(() => {
    if (filters.status || filters.formedAtFrom || filters.formedAtTo) {
        dispatch(fetchCombustionsList(filters));
    } else if (!filters.status && !filters.formedAtFrom && !filters.formedAtTo) {
        // Если сбросили фильтры, грузим всё
         dispatch(fetchCombustionsList(filters));
    }
  }, [filters.status, filters.formedAtFrom, filters.formedAtTo]);


  const handleComplete = async (id: number, action: CompleteCombustionDto) => {
    await dispatch(completeCombustion({ id, action }));
  };

  if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="py-4">
        <BreadCrumbs crumbs={[
            { label: ROUTE_LABELS.COMBUSTIONS_LIST, path: ROUTES.COMBUSTIONS_LIST }
        ]} />

        {/* Панель фильтров */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Создатель (локально)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Поиск по имени..."
                    value={filters.creatorName || ''}
                    onChange={(e) => handleFilterChange('creatorName', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Статус</Form.Label>
                  <Form.Select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">Все</option>
                    <option value="formed">Сформирована</option>
                    <option value="approved">Завершена</option>
                    <option value="rejected">Отклонена</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Дата с</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.formedAtFrom || ''}
                    onChange={(e) => handleFilterChange('formedAtFrom', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Дата по</Form.Label>
                  <Form.Control
                    type="date"
                    value={filters.formedAtTo || ''}
                    onChange={(e) => handleFilterChange('formedAtTo', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex gap-2">
                <Button className="my-btn" onClick={() => dispatch(resetFilters())}>
                  Сбросить
                </Button>
                <Button className="my-btn" onClick={() => dispatch(fetchCombustionsList(filters))}>
                  Применить
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Таблица */}
        {user.name === null ? (
          <Alert variant="warning">Для просмотра заявок необходимо авторизоваться</Alert>
        ) : isLoading && items.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : filteredItems.length === 0 ? (
          <Alert variant="info">Заявки не найдены</Alert>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Создатель</th>
                  <th>Эксперт</th>
                  <th>Статус</th>
                  <th>Дата создания</th>
                  <th>H₂O / CO₂</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.sort((a, b) => a.id - b.id).map((app) => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td>{app.technicianName}</td>
                    <td>{app.expertName || '—'}</td>
                    <td>
                      <Badge bg={
                        app.status === 'approved' ? 'success' : 
                        app.status === 'rejected' ? 'danger' : 'primary'
                      }>
                        {app.status}
                      </Badge>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td>
                      {app.h2oVolume ? `${app.h2oVolume} л / ` : ''}
                      {app.co2Volume ? `${app.co2Volume} л` : '—'}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => navigate(`${ROUTES.COMBUSTION.replace(":id", String(app.id))}`)}
                        >
                            Просмотр
                        </Button>
                        
                        {/* Кнопки для эксперта */}
                        {user.isExpert && app.status !== 'completed' && app.status !== 'draft' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handleComplete(app.id, {action: 'approve'})}
                            >
                              Одобрить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleComplete(app.id, {action: 'reject'})}
                            >
                              Отклонить
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
    </Container>
  );
};

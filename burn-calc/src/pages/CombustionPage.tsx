import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Container, 
  Spinner, 
  Alert, 
  Button, 
  Form, 
  Card, 
  Row, 
  Col 
} from "react-bootstrap";
import type { AppDispatch, RootState } from "../store";
import {
  fetchCombustion,
  updateCombustion,
  removeCompoundFromCombustion,
  updateCompoundCombustion,
  formCombustion,
  deleteCombustion,
  clearCombustion,
} from "../slices/combustionSlice";
import type {
  UpdateCombustionDto,
  UpdateCompoundCombustionDto,
} from "../api/Api";
import { ROUTE_LABELS, ROUTES } from "../Routes";
import "./CombustionPage.css";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const CombustionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { combustion } = useSelector((state: RootState) => state.combustion);

  const [formData, setFormData] = useState({
    h2oVolume: "",
    co2Volume: "",
    sampleDescription: "",
  });
  const [compoundComments, setCompoundComments] = useState<Record<number, string>>({});

  const isDraft = combustion?.status === "draft";
  const isLoading = useSelector((state: RootState) => state.combustion ? false : true);

  useEffect(() => {
    if (id) {
      dispatch(fetchCombustion(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (combustion) {
      setFormData({
        h2oVolume: combustion.h2oVolume?.toString() ?? "",
        co2Volume: combustion.co2Volume?.toString() ?? "",
        sampleDescription: combustion.sampleDescription ?? "",
      });
      const comments: Record<number, string> = {};
      const amounts: Record<number, number> = {};
      combustion.compounds?.forEach((c) => {
        comments[c.id] = (c as any).comment ?? "";
        amounts[c.id] = (c as any).amount ?? 0;
      });
      setCompoundComments(comments);
    }
  }, [combustion]);

  const handleSave = async () => {
    if (!combustion?.id) return;
    const updateData: Partial<UpdateCombustionDto> = {
      h2oVolume: formData.h2oVolume ? Number(formData.h2oVolume) : undefined,
      co2Volume: formData.co2Volume ? Number(formData.co2Volume) : undefined,
      sampleDescription: formData.sampleDescription || undefined,
    };
    await dispatch(updateCombustion(updateData));
  };

  const handleCommentChange = (compoundId: number, value: string) => {
    setCompoundComments((prev) => ({ ...prev, [compoundId]: value }));
  };

  const handleUpdateCompound = async (compoundId: number) => {
    const comment = compoundComments[compoundId] ?? "";
    const updateData: UpdateCompoundCombustionDto = {
      comment,
    } as any;
    await dispatch(updateCompoundCombustion({ compoundId, data: updateData }));
  };

  const handleRemove = async (compoundId: number) => {
    await dispatch(removeCompoundFromCombustion(compoundId));
  };

  const handleForm = async () => {
    if (combustion?.id) {
      await dispatch(formCombustion());
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteCombustion());
    dispatch(clearCombustion());
    navigate(ROUTES.COMPOUNDS_LIST);
  };

  if (!id) {
    return <Container className="py-5"><Alert variant="danger">ID заявки не указан</Alert></Container>;
  }

  if (!combustion) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка заявки...</p>
      </div>
    );
  }

  return (
    <Container className="py-4">
        <BreadCrumbs
        crumbs={isDraft ? [
            { label: ROUTE_LABELS.COMPOUNDS_LIST, path: ROUTES.COMPOUNDS_LIST },
            {label: "Черновик заявки"}
        ] : [
            { label: ROUTE_LABELS.COMBUSTIONS_LIST, path: ROUTES.COMBUSTIONS_LIST },
            { label: "Заявка №" + String(combustion.id) },
        ]}
        />
        {/* Блокирующий оверлей при запросах */}
        {isLoading && (
          <div className="loading-overlay">
            <Spinner animation="border" variant="light" />
            <p className="mt-2 text-white fw-bold">Обработка...</p>
          </div>
        )}

        {/* Блок исходных данных */}
        <section className="data-section mb-4">
            <h3 className="section-title mb-3">Исходные данные</h3>
            <Row className="g-3">
                <Col md={4}>
                <Form.Group>
                    <Form.Label htmlFor="water-volume">Объем выделившегося водяного пара, л:</Form.Label>
                    <Form.Control
                    type="number"
                    id="water-volume"
                    name="h2oVolume"
                    value={formData.h2oVolume}
                    onChange={(e) => setFormData({ ...formData, h2oVolume: e.target.value })}
                    placeholder="Например: 44.8"
                    disabled={!isDraft}
                    />
                </Form.Group>
                </Col>
                <Col md={4}>
                <Form.Group>
                    <Form.Label htmlFor="co2-volume">Объем выделившегося углекислого газа, л:</Form.Label>
                    <Form.Control
                    type="number"
                    id="co2-volume"
                    name="co2Volume"
                    value={formData.co2Volume}
                    onChange={(e) => setFormData({ ...formData, co2Volume: e.target.value })}
                    placeholder="Например: 22.4"
                    disabled={!isDraft}
                    />
                </Form.Group>
                </Col>
                <Col md={4}>
                <Form.Group>
                    <Form.Label htmlFor="sample-description">Описание образца:</Form.Label>
                    <Form.Control
                    type="text"
                    id="sample-description"
                    name="sampleDescription"
                    value={formData.sampleDescription}
                    onChange={(e) => setFormData({ ...formData, sampleDescription: e.target.value })}
                    placeholder={isDraft ? "Опишите образец" : "Нет"}
                    disabled={!isDraft}
                    />
                </Form.Group>
                </Col>
            </Row>
        </section>

        {/* Блок состава заявки */}
        <section className="composition-section mb-4">
          <h3 className="section-title mb-3">Состав заявки</h3>
          {!combustion.compounds?.length ? (
            <Alert variant="info">Соединения не добавлены. Перейдите на страницу списка и добавьте услуги.</Alert>
          ) : (
            <div className="d-flex flex-column gap-3">
              {combustion.compounds.map((compound: any) => (
                <Card key={compound.id} className="request-combustion-card border-0 shadow-sm">
                  <Card.Header className="card-header-gradient">
                    <h5 className="request-combustion-name mb-0">{compound.title}</h5>
                  </Card.Header>
                  <Card.Body className="compound-combustion-card-body align-items-center">
                      <Col xs={14} md={2} className="text-center mb-3 mb-md-0">
                        <div className="request-combustion-image bg-light rounded p-2 d-inline-block">
                          <img
                            src={compound.imageUrl || `/images/${compound.imageFileName}`}
                            alt="Модель молекулы"
                            className="img-fluid"
                            style={{ maxHeight: "120px", objectFit: "contain" }}
                            onError={(e) => (e.currentTarget.src = "/default-compound.png")}
                          />
                        </div>
                      </Col>
                      <Col xs={14} md={9}>
                        <Row className="g-3">
                          <Col sm={6} lg={3}>
                            <Form.Group>
                              <Form.Label>H₂O сгорания, л/моль</Form.Label>
                              <Form.Control type="text" value={compound.specificH2oVolume ?? 0} disabled readOnly />
                            </Form.Group>
                          </Col>
                          <Col sm={6} lg={3}>
                            <Form.Group>
                              <Form.Label>CO₂ сгорания, л/моль</Form.Label>
                              <Form.Control type="text" value={compound.specificCo2Volume ?? 0} disabled readOnly />
                            </Form.Group>
                          </Col>
                          <Col sm={6} lg={3}>
                            <Form.Group>
                              <Form.Label>Комментарий</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder={isDraft ? "Текст..." : "Нет"}
                                value={compoundComments[compound.id] || ""}
                                onChange={(e) => handleCommentChange(compound.id, e.target.value)}
                                disabled={!isDraft}
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={6} lg={3}>
                            {!isDraft ? (<Form.Group>
                              <Form.Label>Количество, моль</Form.Label>
                              <Form.Control type="text" value={compound.amount ?? 0} disabled readOnly />
                            </Form.Group>
                            ) : (
                              <div className="d-flex flex-column gap-2">
                                <Button className="btn-delete-request" size="sm" onClick={() => handleUpdateCompound(compound.id)}>
                                    Сохранить
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleRemove(compound.id)}>
                                    Удалить
                                </Button>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Col>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Кнопки действий */}
        <div className="actions-section text-center">
          {isDraft ? (
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Button className="btn-delete-request" size="lg" onClick={handleSave} disabled={isLoading}>
                Сохранить изменения
              </Button>
              <Button className="btn-delete-request" size="lg" onClick={handleForm} disabled={isLoading}>
                Сформировать заявку
              </Button>
              <Button className="btn-delete-request" size="lg" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Удаление..." : "Очистить заявку"}
              </Button>
            </div>
          ) : (
            <Alert variant="light" className="d-inline-block mb-0">
              Статус заявки: <strong>{combustion.status}</strong>. Редактирование недоступно.
            </Alert>
          )}
        </div>
    </Container>
  );
};
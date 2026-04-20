import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompoundById, getCompoundsByName, type Compound } from "../modules/compoundsApi";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { Container, Spinner, Card, Row, Col, ProgressBar } from "react-bootstrap";
import { COMPOUNDS_MOCK } from "../modules/mock";
import { useSemanticSearch } from "../hooks/useSemanticSearch";
import { SimilarCompoundCard } from "../components/SimilarCompoundCard";
import "./DetailPage.css";

export const DetailPage: FC = () => {
  const { id } = useParams();
  const [compound, setCompound] = useState<Compound | null>(null);
  const [loading, setLoading] = useState(true);

  // Состояние для всех соединений (нужно для воркера)
  const [allCompounds, setAllCompounds] = useState<Compound[]>([]);

  // Используем хук семантического поиска
  const { similarCompounds, isModelReady, areEmbeddingsReady, progress } = useSemanticSearch(allCompounds, Number(id));
  
  useEffect(() => {
    // Загружаем все соединения один раз для инициализации воркера
    getCompoundsByName()
      .then(response => setAllCompounds(response))
      .catch(() => setAllCompounds(COMPOUNDS_MOCK));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCompoundById(id)
      .then(response => setCompound(response))
      .catch(() => setCompound(COMPOUNDS_MOCK.find(compound => compound.id.toString() === id) || null));
    setLoading(false);
  }, [id]);

  if (loading)
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!compound)
    return <div className="text-center mt-4"><h2>Соединение не найдено</h2></div>;

  return (
    <Container className="py-4">
      <BreadCrumbs
        crumbs={[
          { label: ROUTE_LABELS.LIST, path: ROUTES.LIST },
          { label: compound.title },
        ]}
      />

      <Row className="justify-content-center gap-3">
        <Col lg={5}>
          <Card className="border-0 bg-transparent">
            <div className="media-wrapper">
              <div className="video-wrapper">
                <video
                  crossOrigin="anonymous"
                  aria-hidden="true"
                  autoPlay
                  playsInline
                  loop
                  muted
                  controls
                  width="100%"
                  className="video-placeholder"
                  src={`${compound.videoUrl}`}
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    if (target.src !== window.location.origin + "/default-video.mp4") {
                      target.src = "/default-video.mp4";
                      target.load();
                    }
                  }}
                />
              </div>
              <div className="caption-container">
                <Card.Body className="text-white p-0">
                  <Card.Title>{compound.title}</Card.Title>
                  <Card.Text>Класс: {compound.class}</Card.Text>
                  <Card.Text>Брутто-формула: {compound.formula}</Card.Text>
                  <Card.Text>
                    При сгорании выделяет {compound.specificH2oVolume} л H<sub>2</sub>O и{" "}
                    {compound.specificCo2Volume} л CO<sub>2</sub> на каждый моль вещества
                  </Card.Text>
                  <Card.Text>{compound.description}</Card.Text>
                </Card.Body>
              </div>
            </div>
          </Card>
        </Col>
        <Col lg={5}>
          <div>
            <h5>Похожие соединения</h5>
            {!isModelReady ? (
              <div className="text-center p-3">
                <small className="text-muted">Загрузка нейросети...</small>
                <ProgressBar now={progress} label={`${Math.round(progress)}%`} animated />
              </div>
            ) : !areEmbeddingsReady ? (
              <div className="text-center p-3">
                <Spinner animation="border" size="sm" />
              </div>
            ) : similarCompounds.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {similarCompounds.map((compound) => (
                  <div key={compound.id}><SimilarCompoundCard compound={compound} /></div>
                ))}
              </div>
            ) : (
              <p className="text-muted small p-3 mb-0">Похожие соединения не найдены</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

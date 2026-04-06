import type { FC } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompoundById } from "../modules/compoundsApi";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { Container, Spinner, Card, Row, Col } from "react-bootstrap";
import "./DetailPage.css";

export const DetailPage: FC = () => {
  const { id } = useParams();
  const [compound, setCompound] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCompoundById(id).then((data) => {
      setCompound(data);
      setLoading(false);
    });
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

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
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
                  src={`/videos/${compound.videoUrl}`}
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
                </Card.Body>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

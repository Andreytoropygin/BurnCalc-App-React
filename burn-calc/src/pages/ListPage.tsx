import type { FC } from "react";
import type { Compound } from "../modules/compoundsApi";
import { useState, useEffect } from "react";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { SearchField } from "../components/SearchField";
import { getCompoundsByName } from "../modules/compoundsApi";
import { CompoundCard } from "../components/CompoundCard";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import { CombustionWidget } from "../components/CombustionWidget";
import "./ListPage.css"

export const ListPage: FC = () => {
  const [query, setQuery] = useState("");
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getCompoundsByName(query);
      setCompounds(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Container className="py-4">
      <BreadCrumbs crumbs={[{ label: ROUTE_LABELS.LIST, path: ROUTES.LIST }]} />

      <SearchField
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        loading={loading}
      />

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && (
        <Row className="g-4 justify-content-start">
          {compounds.length > 0 ? (
            compounds.map((compound) => (
              <Col key={compound.id} xs={12} sm={6} md={4} lg={3}>
                <CompoundCard compound={compound} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center mt-5">
              <h3>По вашему запросу ничего не найдено</h3>
            </Col>
          )}
        </Row>
      )}

      <CombustionWidget />
    </Container>
  );
};

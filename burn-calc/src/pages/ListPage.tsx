import type { FC } from "react";
import type { Compound } from "../modules/compoundsApi";
import { getCombustionDraftBrief, type CombustionDraftBrief } from "../modules/combustionsApi";
import { useState, useEffect } from "react";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { SearchField } from "../components/SearchField";
import { getCompoundsByName } from "../modules/compoundsApi";
import { CompoundCard } from "../components/CompoundCard";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import { CombustionWidget } from "../components/CombustionWidget";
import { COMPOUNDS_MOCK } from "../modules/mock";
import "./ListPage.css"

export const ListPage: FC = () => {
  const [query, setQuery] = useState("");
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [draft, setDraft] = useState<CombustionDraftBrief | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSearch = async () => {
    setLoading(true);
    getCompoundsByName(query)
      .then(response => setCompounds(response))
      .catch(() => setCompounds(COMPOUNDS_MOCK.filter(compound => 
        compound.title
          .toLowerCase()
          .startsWith(query.toLowerCase())
      )));
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
    getCombustionDraftBrief().then(response => setDraft(response))
  }, []);

  return (
    <Container className="py-4">
      <BreadCrumbs crumbs={[
        { label: ROUTE_LABELS.LIST, path: ROUTES.LIST }
      ]} />

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
        <Row className="g-4 compounds-grid">
          {compounds.length > 0 ? (
            compounds.map((compound) => (
              <Col key={compound.id} xs="auto">
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

      {draft && <CombustionWidget count={draft.compoundsCount} />}
    </Container>
  );
};

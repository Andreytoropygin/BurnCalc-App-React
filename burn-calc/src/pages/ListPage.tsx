import type { FC } from "react";
import type { Compound } from "../modules/compoundsApi";
import { getCombustionDraftBrief, type CombustionDraftBrief } from "../modules/combustionsApi";
import { useState, useEffect, useRef } from "react";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { SearchField } from "../components/SearchField";
import { getCompoundsByName } from "../modules/compoundsApi";
import { CompoundCard } from "../components/CompoundCard";
import { Container, Spinner, Row, Col, Button, ProgressBar } from "react-bootstrap";
import { CombustionWidget } from "../components/CombustionWidget";
import { COMPOUNDS_MOCK } from "../modules/mock";
import { useCompoundSearch } from "../hooks/useCompoundSearch";
import "./ListPage.css";

export const ListPage: FC = () => {
  const [query, setQuery] = useState("");
  const [rawCompounds, setRawCompounds] = useState<Compound[]>([]);
  const [draft, setDraft] = useState<CombustionDraftBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Используем хук для поиска по картинке
  const { compounds, ready, progress, searchByImage, resetSearch } = useCompoundSearch(rawCompounds);

  const handleSearch = async () => {
    setLoading(true);
    await getCompoundsByName(query)
      .then(response => setRawCompounds(response))
      .catch(() => setRawCompounds(COMPOUNDS_MOCK.filter(compound =>
        compound.title
          .toLowerCase()
          .startsWith(query.toLowerCase())
      )));
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
    getCombustionDraftBrief().then(response => setDraft(response));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      searchByImage(file);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    resetSearch();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

      <div className="image-search-section mb-4 p-3 bg-light rounded">
        <h5 className="mb-3">Поиск по изображению</h5>
        <div className="d-flex gap-3 align-items-start flex-wrap">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageUpload}
            disabled={!ready}
          />

          <div style={{ flexShrink: 0 }}>
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Query" 
                className="preview-image"
              />
            ) : (<div className="placeholder-image">Нет фото</div>)}
          </div>

          <div className="d-flex flex-column gap-2" style={{ minWidth: '200px' }}>
            <Button
              className="load-image-btn"
              onClick={() => fileInputRef.current?.click()} 
              disabled={!ready}
            >
              {ready ? 'Загрузить фото' : 'Загрузка нейросети...'}
            </Button>

            {!ready && (
              <ProgressBar 
                now={progress} 
                label={`${Math.round(progress)}%`} 
                animated
              />
            )}

            <Button
              className="reset-image-search-btn"
              onClick={handleClear} 
              disabled={!selectedImage}
            >
              Сбросить
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && (
        <Row className="g-4 compounds-grid">
          {compounds.filter(compound => compound.isVisible).length > 0 ? (
            compounds.filter(compound => compound.isVisible).map((compound) => (
              <Col key={compound.id} xs="auto">
                <CompoundCard compound={compound} similarityScore={compound.score} />
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

import { useState, type FC } from "react";
import type { Compound } from "../modules/compoundsApi";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { Card, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { addToDraft } from "../slices/draftWidgetSlice";
import "./CompoundCard.css";
import defaultImage from "../../public/default-compound.png"

interface Props {
  compound: Compound;
  similarityScore?: number;
}

export const CompoundCard: FC<Props> = ({ compound, similarityScore }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.user.name);
  const [ isAdding, setIsAdding ] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    try {
      dispatch(addToDraft(compound.id));
    } catch (error) {
      console.error("Ошибка добавления в заявку:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="compound-card">
      <Link to={`${ROUTES.COMPOUND.replace(":id", String(compound.id))}`} className="card-link">
        <Card.Img
          variant="top"
          src={`${compound.imageUrl}`}
          className="compound-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <Card.Body className="compound-card-body">
          <Card.Title className="compound-title">{compound.title}</Card.Title>
          <Card.Text className="compound-formula mb-0">{compound.formula}</Card.Text>
          
          {similarityScore !== undefined && similarityScore > 0 && (
            <div className="similarity-badge mt-2">
              <small className="text-muted">
                Сходство: {(similarityScore * 100).toFixed(1)}%
              </small>
            </div>
          )}
        </Card.Body>
      </Link>
      {userName !== null && (
        <Button
          size="sm"
          className="w-100 my-btn"
          onClick={handleAdd}
          disabled={isAdding}
        >
          {isAdding ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            'Добавить'
          )}
        </Button>
      )}
    </div>
  );
};

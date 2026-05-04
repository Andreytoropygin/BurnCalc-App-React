import type { FC } from "react";
import type { Compound } from "../modules/compoundsApi";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { Card } from "react-bootstrap";
import "./CompoundCard.css";

interface Props {
  compound: Compound;
  similarityScore?: number;
}

export const CompoundCard: FC<Props> = ({ compound, similarityScore }) => {
  return (
    <Card className="compound-card h-100">
      <Link to={`${ROUTES.DETAIL.replace(":id", String(compound.id))}`} className="card-link">
        <Card.Img
          variant="top"
          src={`${compound.imageUrl}`}
          className="compound-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-compound.png";
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
    </Card>
  );
};

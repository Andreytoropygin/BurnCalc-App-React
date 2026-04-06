import type { FC } from "react";
import type { Compound } from "../modules/compoundsApi";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import { Card } from "react-bootstrap";
import "./CompoundCard.css";

interface Props {
  compound: Compound;
}

export const CompoundCard: FC<Props> = ({ compound }) => {
  return (
    <Card className="compound-card h-100">
      <Link to={`${ROUTES.DETAIL.replace(":id", String(compound.id))}`} className="card-link">
        <Card.Img
          variant="top"
          src={`/images/${compound.imageUrl}`}
          className="compound-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-compound.png";
          }}
        />
        <Card.Body className="compound-card-body">
          <Card.Title className="compound-title">{compound.title}</Card.Title>
          <Card.Text className="compound-formula">{compound.formula}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
};

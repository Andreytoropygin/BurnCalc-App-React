import type { FC } from "react";
import type { SimilarCompound } from "../hooks/useSemanticSearch";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";
import "./SimilarCompoundCard.css"


export const SimilarCompoundCard: FC<{ compound: SimilarCompound }> = ({ compound }) => (
    <Link
      to={`${ROUTES.DETAIL.replace(":id", String(compound.id))}`}
      className="similar-compound-row d-flex align-compounds-center gap-2 p-2 rounded hover-shadow text-decoration-none"
    >
      <img
        src={`${compound.imageUrl}`}
        alt={compound.title}
        className="similar-compound-img"
        style={{
          objectFit: 'contain',
          flexShrink: 0 
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/default-compound.png";
        }}
      />
      <div className="similar-compound-info d-flex flex-column">
        <span className="fw-semibold text-dark">{compound.title}</span>
        <span className="text-muted small">{compound.description}</span>
      </div>
      <div className="similarity-info d-flex flex-column">
        <span className="text-muted small">Сходство<br/></span>
        <span className="text-muted small">{compound.score.toFixed(2)}%</span>
      </div>
    </Link>
  );
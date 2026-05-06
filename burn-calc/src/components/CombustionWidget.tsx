import type { FC } from "react";
import { Badge } from "react-bootstrap";
import "./CombustionWidget.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";

interface Props {
  id: number | null;
  count: number;
}

export const CombustionWidget: FC<Props> = ({ id, count }) => (
  <>
  { id ? (
    <Link 
      to={`${ROUTES.COMBUSTION.replace(":id", String(id))}`}
      className="text-decoration-none"
    >
      <div className="combustion-widget active-combustion">
        <i className="fas fa-fire"></i>
        <Badge bg="danger" className="compounds-count">
          {count}
        </Badge>
      </div>
    </Link>
  ) : (
    <div className="combustion-widget">
      <i className="fas fa-fire"></i>
    </div>
  )}
  </>
);

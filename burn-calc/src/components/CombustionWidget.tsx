import type { FC } from "react";
import { Badge } from "react-bootstrap";
import "./CombustionWidget.css";

interface Props {
  count: number;
}

export const CombustionWidget: FC<Props> = ({ count }) => (
  <div className="combustion-widget">
    <i className="fas fa-fire"></i>
    {count > 0 && (
      <Badge bg="danger" className="compounds-count">
        {count}
      </Badge>
    )}
  </div>
);

import { Link } from "react-router-dom";
import type { FC } from "react";
import { Fragment } from "react";
import { ROUTES } from "../Routes";
import "./BreadCrumbs.css"

interface Crumb {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  crumbs: Crumb[];
}

export const BreadCrumbs: FC<BreadCrumbsProps> = ({ crumbs }) => {
  return (
    <ul className="breadCrumbs">
      <li>
        <Link to={ROUTES.HOME}>Главная</Link>
      </li>
      {crumbs.map((crumb, index) => (
        <Fragment key={index}>
          <li className="slash">/</li>
          {index === crumbs.length - 1 ? (
            <li>{crumb.label}</li>
          ) : (
            <li>
              <Link to={crumb.path || "/"}>{crumb.label}</Link>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
};

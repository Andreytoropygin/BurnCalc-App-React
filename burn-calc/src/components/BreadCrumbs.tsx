import { Link } from "react-router-dom";
import type { FC } from "react";
import { Fragment } from "react";
import "./BreadCrumbs.css"

interface Crumb {
  label: string;
  path?: string;
}

interface Props {
  crumbs: Crumb[];
}

export const BreadCrumbs: FC<Props> = ({ crumbs }) => {
  return (
    <ul className="breadCrumbs">
      {crumbs.map((crumb, index) => (
        <Fragment key={index}>
          {index === crumbs.length - 1 ? (
            <li>{crumb.label}</li>
          ) : (
            <>
              <li>
                <Link to={crumb.path || "/"}>{crumb.label}</Link>
              </li>
              <li className="slash">/</li>
            </>
          )}
        </Fragment>
      ))}
    </ul>
  );
};

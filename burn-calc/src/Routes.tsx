export const ROUTES = {
    LIST: "/compounds",
    DETAIL: "/compound/:id",
  };
  
  export type RouteKeyType = keyof typeof ROUTES;
  
  export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    LIST: "Соединения",
    DETAIL: "Подробнее",
  };

export const ROUTES = {
    HOME: "/",
    LIST: "/compounds",
    DETAIL: "/compound/:id",
  };
  
  export type RouteKeyType = keyof typeof ROUTES;
  
  export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    HOME: "Главная",
    LIST: "Соединения",
    DETAIL: "Подробнее",
  };

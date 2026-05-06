export const ROUTES = {
    COMPOUNDS_LIST: "/compounds",
    COMPOUND: "/compound/:id",
    COMBUSTIONS_LIST: "/combustions",
    COMBUSTION: "/combustion/:id",
    LOGIN: '/login',
    REGISTER: '/register',
  };
  
  export type RouteKeyType = keyof typeof ROUTES;
  
  export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
    COMPOUNDS_LIST: "Соединения",
    COMPOUND: "Подробнее",
    COMBUSTIONS_LIST: "Заявки",
    COMBUSTION: "Заявка",
    LOGIN: 'Вход',
    REGISTER: 'Регистрация',
  };

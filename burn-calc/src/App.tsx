import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AppNavbar } from "./components/Navbar";
import { ListPage } from "./pages/ListPage";
import { DetailPage } from "./pages/DetailPage";
import { ROUTES } from "./Routes";

export const App: FC = () => {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path={ROUTES.LIST} element={<ListPage />} />
        <Route path={ROUTES.DETAIL} element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

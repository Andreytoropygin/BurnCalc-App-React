import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AppNavbar } from "./components/Navbar";
import { CompoundListPage } from "./pages/CompoundsListPage";
import { CompoundPage } from "./pages/CompoundPage";
import { ROUTES } from "./Routes";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CombustionPage } from "./pages/CombustionPage";
import { CombustionsListPage } from "./pages/CombustionsListPage";

export const App: FC = () => {
  return (
    <BrowserRouter basename="/">
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/compounds" replace />} />
        <Route path={ROUTES.COMPOUNDS_LIST} element={<CompoundListPage />} />
        <Route path={ROUTES.COMPOUND} element={<CompoundPage />} />
        <Route path={ROUTES.COMBUSTIONS_LIST} element={<CombustionsListPage />} />
        <Route path={ROUTES.COMBUSTION} element={<CombustionPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

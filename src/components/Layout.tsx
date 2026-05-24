import { type FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MAIN_CLASS_BY_PATH: Record<string, string> = {
  "/": "home-bg",
  "/result": "result-layout",
};

const Layout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainClass = MAIN_CLASS_BY_PATH[location.pathname] ?? "";

  return (
    <div className="layout">
      <header className="header">
        <button
          type="button"
          className="header-logo"
          onClick={() => navigate("/")}
          aria-label="На главную"
        >
          <img src="../src/assets/logo.svg" alt="FLOWWOW" />
        </button>
        <h1 className="visually-hidden">FLOWWOW: ПИОНОВЫЙ ПРЕДСКАЗАТЕЛЬ</h1>
      </header>

      <motion.main
        key={location.pathname}
        className={mainClass}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;

import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { DashboardView } from "../views";
import { AppContext } from "../app.context";

export const RestrictedRoute = () => {
  const { driver } = useContext(AppContext);
  const location = useLocation();
  return driver === null ? (
    <Navigate to="/connect" replace state={{ from: location.pathname }} />
  ) : (
    <DashboardView driver={driver} />
  );
};

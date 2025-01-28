import { Driver } from "neo4j-driver";
import { FC } from "react";
import { Navigate, useLocation } from "react-router";
import { DashboardView } from "../views";
import { ColorMode } from "@xyflow/react";

export const RestrictedRoute: FC<{ driver: Driver | null, setColorMode: React.Dispatch<React.SetStateAction<ColorMode>>, colorMode: ColorMode }> = ({ driver, setColorMode, colorMode }) => {
	const location = useLocation();
	return driver === null ? <Navigate to='/connect' replace state = {{ from: location.pathname }
} /> : <DashboardView driver={driver} colorMode={colorMode} setColorMode={setColorMode} / >;
}


import { Driver } from "neo4j-driver";
import { createContext } from "react";

export type DashboardContextProps = {
    driver: Driver;
};

export const DashboardContext = createContext<DashboardContextProps>({
    driver: {} as Driver,
});

import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { RestrictedRoute } from "./components";
import { ThemeProvider as Flowbite } from "flowbite-react";
import { Route, Routes } from "react-router";
import { ConnectView } from "./views";
import { SnackbarProvider } from "notistack";
import { theme } from "./flowbite.theme";
import { AppProvider } from "./providers";

export default function App() {
  return (
    <AppProvider>
      <Flowbite theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <ReactFlowProvider>
            <Routes>
              <Route path="/" element={<RestrictedRoute />} />
              <Route path="/connect" element={<ConnectView />} />
            </Routes>
          </ReactFlowProvider>
        </SnackbarProvider>
      </Flowbite>
    </AppProvider>
  );
}

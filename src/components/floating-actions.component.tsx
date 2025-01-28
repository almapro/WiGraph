import { Panel } from "@xyflow/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FloatingButtonComponent } from "./floating-actions";
import { useContext } from "react";
import { AppContext } from "../app.context";
import { VscDebugDisconnect } from "react-icons/vsc";

export const FloatingActionsComponent = () => {
	const { colorMode, setColorMode, setDriver, driver } = useContext(AppContext);
	return (
		<Panel position= "top-right" className = "flex flex-col gap-2" >
			<FloatingButtonComponent
				tooltip="Toggle color mode"
	onClick = {
		() =>
setColorMode(colorMode === "dark" ? "light" : "dark")
	}
			>
	{ colorMode === "dark" ? (
		<FaSun className= "m-auto" />
		) : (
	<FaMoon className= "m-auto" />
			)}
</FloatingButtonComponent>
	< FloatingButtonComponent tooltip = "Disconnect" onClick = {() => { driver?.close(); setDriver(null); }}> <VscDebugDisconnect className="m-auto" /> </FloatingButtonComponent >
		</Panel>
	);
};

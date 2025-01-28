import { ColorMode, Panel } from "@xyflow/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FloatingButtonComponent } from "./floating-actions";

export const FloatingActionsComponent: React.FC<{
	colorMode: ColorMode;
	setColorMode: React.Dispatch<React.SetStateAction<ColorMode>>;
}> = ({ colorMode, setColorMode }) => {
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
	</Panel>
	);
};

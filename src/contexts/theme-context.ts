import { createContext } from "react";
import { ThemeContextType } from "../types/theme";

export const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

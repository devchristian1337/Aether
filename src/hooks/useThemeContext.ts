import { useContext } from "react";
import { ThemeContextType } from "../types/theme";
import { ThemeContext } from "../contexts/theme-context";

export const THEME_STORAGE_KEY = "app-theme-mode";

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

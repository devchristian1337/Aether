import { Theme } from "@mui/material/styles";

export interface ThemeContextType {
  mode: "light" | "dark";
  toggleTheme: () => void;
}

declare module "@mui/material/styles" {
  interface CustomTheme extends Theme {
    custom?: {
      transitions: {
        theme: string;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      transitions: {
        theme: string;
      };
    };
  }
}

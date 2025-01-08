import {
  createTheme,
  responsiveFontSizes,
  Theme,
  ThemeOptions,
} from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        } as const,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
        },
      },
    },
  },
};

const lightThemeOptions: ThemeOptions = deepmerge(baseThemeOptions, {
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
  },
});

const darkThemeOptions: ThemeOptions = deepmerge(baseThemeOptions, {
  palette: {
    mode: "dark",
    primary: {
      main: "#40a9ff",
      light: "#69b6ff",
      dark: "#096dd9",
    },
    secondary: {
      main: "#ba68c8",
      light: "#cf94d9",
      dark: "#883997",
    },
    background: {
      default: "#1c1c24",
      paper: "#2a2a36",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
});

export const lightTheme: Theme = responsiveFontSizes(
  createTheme(lightThemeOptions)
);
export const darkTheme: Theme = responsiveFontSizes(
  createTheme(darkThemeOptions)
);

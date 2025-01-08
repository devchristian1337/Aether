import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { styled } from "@mui/material/styles";
import { useThemeContext } from "../hooks/useThemeContext";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.03)",
  },
  "&:active": {
    transform: "scale(0.95)",
    transition: "transform 0.1s",
  },
  color:
    theme.palette.mode === "dark"
      ? theme.palette.primary.main
      : theme.palette.primary.dark,
}));

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <StyledIconButton
      onClick={toggleTheme}
      aria-label={`Toggle ${mode === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
    >
      {mode === "light" ? (
        <Brightness4Icon aria-hidden="true" />
      ) : (
        <Brightness7Icon aria-hidden="true" />
      )}
    </StyledIconButton>
  );
}

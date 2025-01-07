import * as React from "react";
import clsx from "clsx";
import { styled } from "@mui/system";
import { ButtonOwnProps } from "@mui/base/Button";

interface CustomButtonProps extends ButtonOwnProps {
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "button" | "reset";
  sx?: React.CSSProperties;
  variant?: "primary" | "secondary";
  component?: React.ElementType;
  size?: "small" | "medium" | "large";
}

const CustomButtonRoot = styled("button")<{
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}>(
  ({ theme, variant = "primary", size = "medium" }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background: ${
    variant === "primary"
      ? "linear-gradient(135deg, #40a9ff 0%, #096dd9 100%)"
      : "linear-gradient(135deg, #2a2a36 0%, #32323f 100%)"
  };
  padding: ${
    size === "small" ? "8px" : size === "medium" ? "10px 20px" : "12px 24px"
  };
  border-radius: 8px;
  color: white;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: ${size === "small" ? "36px" : "auto"};
  box-shadow: ${
    variant === "primary"
      ? "0 2px 8px rgba(64, 169, 255, 0.25)"
      : "0 2px 8px rgba(0, 0, 0, 0.15)"
  };

  &:hover {
    transform: translateY(-1px);
    background: ${
      variant === "primary"
        ? "linear-gradient(135deg, #69b9ff 0%, #1a7fd4 100%)"
        : "linear-gradient(135deg, #32323f 0%, #3a3a47 100%)"
    };
    box-shadow: ${
      variant === "primary"
        ? "0 4px 12px rgba(64, 169, 255, 0.35)"
        : "0 4px 12px rgba(0, 0, 0, 0.25)"
    };
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${
      variant === "primary"
        ? "0 1px 4px rgba(64, 169, 255, 0.2)"
        : "0 1px 4px rgba(0, 0, 0, 0.1)"
    };
  }

  &.disabled {
    background: ${theme.palette.mode === "dark" ? "#32323f" : "#e5e5e5"};
    color: ${theme.palette.mode === "dark" ? "#666" : "#999"};
    cursor: default;
    box-shadow: none;
    transform: none;
    opacity: 0.6;
    pointer-events: none;
  }

  & svg {
    font-size: ${size === "small" ? "18px" : "20px"};
  }
`
);

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(function CustomButton(props, ref) {
  const {
    children,
    disabled,
    type = "button",
    sx,
    component: Component = "button",
    size = "medium",
    ...other
  } = props;

  return (
    <CustomButtonRoot
      as={Component}
      ref={ref}
      type={type}
      disabled={disabled}
      size={size}
      style={sx}
      {...other}
      className={clsx({
        disabled,
      })}
    >
      {children}
    </CustomButtonRoot>
  );
});

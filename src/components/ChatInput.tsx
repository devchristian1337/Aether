import { useState } from "react";
import { TextField, Box, Tooltip } from "@mui/material";
import { ArrowUpward as ArrowUpwardIcon } from "@mui/icons-material";
import { CustomButton } from "./CustomButton";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 2,
        width: "100%",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "-1.5px",
            padding: "1.5px",
            borderRadius: "4px",
            background: isFocused
              ? "linear-gradient(var(--angle), rgba(0, 0, 0, 0.3), #687aff)"
              : "transparent",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: isFocused ? "8s rotate linear infinite" : "none",
            "@keyframes rotate": {
              to: {
                "--angle": "360deg",
              },
            },
          },
          "@property --angle": {
            syntax: "'<angle>'",
            initialValue: "0deg",
            inherits: "false",
          },
        }}
      >
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder="Enter something..."
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#32323f",
              borderRadius: "4px",
              height: "40px",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "rgba(64, 169, 255, 0.3)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
            },
            "& .MuiInputBase-input": {
              color: "text.primary",
              height: "8px",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 0.7,
              },
            },
          }}
        />
      </Box>
      <Tooltip title={!input.trim() ? "Empty message" : "Send message"}>
        <span>
          <CustomButton
            type="submit"
            disabled={disabled || !input.trim()}
            variant="primary"
            size="small"
            sx={{
              minWidth: "40px",
              height: "40px",
              padding: 0,
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: "20px" }} />
          </CustomButton>
        </span>
      </Tooltip>
    </Box>
  );
}

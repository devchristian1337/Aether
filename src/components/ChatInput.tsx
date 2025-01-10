import { useState } from "react";
import { TextField, Box, Tooltip, useTheme } from "@mui/material";
import { ArrowUpward as ArrowUpwardIcon } from "@mui/icons-material";
import { CustomButton } from "./CustomButton";
import { VoiceInput } from "./VoiceInput";

/**
 * Interface for the props of the ChatInput component.
 * @interface ChatInputProps
 * @property {(message: string) => void} onSend - Callback function triggered when a message is sent
 * @property {boolean} [disabled] - Optional flag to disable the input field and send button
 */
interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  error?: string;
}

/**
 * A component that renders a styled text input field with a send button for chat messages.
 * Features include:
 * - Animated focus state with gradient border
 * - Disabled state handling
 * - Empty message validation
 * - Responsive design
 * - Theme-aware styling
 *
 * @component
 * @param {ChatInputProps} props - The component props
 * @returns {JSX.Element} A chat input form with send button
 */
export function ChatInput({ onSend, disabled, error }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSend(input);
        setInput("");
      } catch (error) {
        // Error handling is done through the error prop
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInput((prev) => prev + (prev ? ' ' : '') + transcript);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      role="form"
      aria-label="Chat message input"
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
              ? `linear-gradient(var(--angle), ${theme.palette.action.hover}, ${theme.palette.primary.main})`
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
          disabled={disabled || isSubmitting}
          error={!!error}
          helperText={error}
          placeholder={isSubmitting ? "Sending..." : "Enter something..."}
          variant="outlined"
          aria-label="Message input"
          aria-invalid={!!error}
          aria-describedby={error ? "chat-input-error" : undefined}
          aria-busy={isSubmitting}
          inputProps={{
            "aria-label": "Chat message",
            role: "textbox",
            "aria-multiline": "false",
          }}
          FormHelperTextProps={{
            id: "chat-input-error",
            role: "alert",
            "aria-live": "polite",
            sx: {
              position: "absolute",
              bottom: "-20px",
              color: theme.palette.error.main,
              margin: 0,
            },
          }}
          sx={{
            mb: error ? 2.5 : 0,
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.paper,
              borderRadius: "4px",
              height: "40px",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main + "4D", // 30% opacity
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
      <VoiceInput onTranscript={handleVoiceInput} disabled={disabled || isSubmitting} />
      <Tooltip
        title={
          isSubmitting
            ? "Sending message..."
            : disabled
            ? "Chat disabled"
            : !input.trim()
            ? "Empty message"
            : error
            ? "Failed to send - Click to retry"
            : "Send message"
        }
      >
        <span>
          <CustomButton
            type="submit"
            disabled={disabled || (!input.trim() && !error) || isSubmitting}
            variant="primary"
            size="small"
            aria-label={isSubmitting ? "Sending message" : "Send message"}
            sx={{
              minWidth: "40px",
              height: "40px",
              padding: 0,
              opacity: isSubmitting ? 0.7 : 1,
              transition: "opacity 0.3s ease",
              ...(error && {
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
              }),
            }}
          >
            <ArrowUpwardIcon
              sx={{
                fontSize: "20px",
                transform: isSubmitting ? "translateY(-2px)" : "none",
                transition: "transform 0.3s ease",
              }}
            />
          </CustomButton>
        </span>
      </Tooltip>
    </Box>
  );
}

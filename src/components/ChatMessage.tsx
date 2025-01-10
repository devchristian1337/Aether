import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import ProgressiveImage from "./ProgressiveImage";
import {
  SmartToy as SmartToyIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { Message } from "../types";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Interface for the props of the ChatMessage component.
 * @interface ChatMessageProps
 * @property {Message} message - The message object containing content, role, timestamp, and optional file names.
 */
interface ChatMessageProps {
  message: Message;
}

/**
 * A component that renders a chat message with support for markdown content, avatars, and file attachments.
 * Features include:
 * - Different styling for user and assistant messages
 * - Markdown rendering with code block support
 * - Copy to clipboard functionality for assistant messages
 * - Timestamp display
 * - File attachment display
 * - Responsive design
 *
 * @component
 * @param {ChatMessageProps} props - The component props
 * @returns {JSX.Element} A rendered chat message
 */
export default function ChatMessage({ message }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === "user";
  const theme = useTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Box
      role="article"
      aria-label={`${isUser ? "Your" : "Assistant's"} message from ${format(
        new Date(message.timestamp),
        "HH:mm"
      )}`}
      sx={{
        display: "flex",
        gap: { xs: 1, sm: 1.5 },
        mb: { xs: 1, sm: 1.5 },
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
      }}
    >
      {/* Avatar */}
      <Avatar
        aria-label={`${isUser ? "User" : "Assistant"} avatar`}
        sx={{
          bgcolor: isUser ? "#40a9ff" : "#10b981",
          width: { xs: 28, sm: 32 },
          height: { xs: 28, sm: 32 },
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
        ) : (
          <SmartToyIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
        )}
      </Avatar>

      {/* Message Content */}
      <Box
        sx={{
          maxWidth: { xs: "80%", sm: "85%" },
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          alignItems: isUser ? "flex-end" : "flex-start",
          position: "relative",
        }}
      >
        {/* Role & Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            lineHeight: 1,
            mb: -0.25,
          }}
        >
          {isUser ? "You" : "Assistant"} •{" "}
          {format(new Date(message.timestamp), "HH:mm")}
        </Typography>

        {/* Message Bubble */}
        <Box
          role="region"
          aria-label={`Message ${message.error ? "with error" : "content"}`}
          sx={{
            width: "100%",
            position: "relative",
            bgcolor: message.error
              ? theme.palette.error.dark
              : isUser
              ? "#40a9ff"
              : "#2a2a36",
            color: "white",
            py: { xs: 1, sm: 1.25 },
            px: { xs: 1.5, sm: 2 },
            pr: !isUser ? { xs: 3.5, sm: 4 } : { xs: 1.5, sm: 2 },
            borderRadius: { xs: 1.5, sm: 2 },
            borderTopRightRadius: isUser ? 0 : { xs: 1.5, sm: 2 },
            borderTopLeftRadius: isUser ? { xs: 1.5, sm: 2 } : 0,
            boxShadow: message.error
              ? `0 1px 8px ${theme.palette.error.main}40`
              : "0 1px 8px rgba(0,0,0,0.1)",
            ...(message.error && {
              "&::before": {
                content: '"⚠"',
                position: "absolute",
                top: "-8px",
                left: isUser ? "auto" : "-8px",
                right: isUser ? "-8px" : "auto",
                backgroundColor: theme.palette.error.main,
                color: "white",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              },
            }),
            "& pre": {
              bgcolor: "rgba(0,0,0,0.2)",
              p: { xs: 1, sm: 1.5 },
              borderRadius: 1,
              overflow: "auto",
              my: 0.75,
              maxHeight: { xs: "300px", sm: "400px" },
            },
            "& code": {
              bgcolor: "rgba(0,0,0,0.2)",
              px: { xs: 0.75, sm: 1 },
              py: 0.25,
              borderRadius: 0.5,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
            },
            "& p": {
              my: 0.25,
            },
            "&:hover .copy-button": {
              opacity: 1,
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <Typography
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    lineHeight: 1.4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {children}
                </Typography>
              ),
              pre: ({ children }) => <pre>{children}</pre>,
              code: ({ className, children }) => {
                return <code className={className}>{children}</code>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {!isUser && (
            <Tooltip title={isCopied ? "Copied!" : "Copy message"}>
              <IconButton
                onClick={handleCopy}
                size="small"
                className="copy-button"
                aria-label={isCopied ? "Message copied" : "Copy message"}
                sx={{
                  position: "absolute",
                  top: { xs: 4, sm: 6 },
                  right: { xs: 4, sm: 6 },
                  padding: { xs: 0.5, sm: 0.75 },
                  color: "white",
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(4px)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                {isCopied ? (
                  <CheckIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
                ) : (
                  <CopyIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <Box
            role="list"
            aria-label="Attachments"
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: isUser ? "flex-end" : "flex-start",
              maxWidth: "100%",
              mt: 1,
            }}
          >
            {message.attachments.map((attachment, index) =>
              attachment.type === "image" ? (
                <Box
                  key={index}
                  role="listitem"
                  aria-label={`Image: ${attachment.fileName}`}
                  sx={{
                    width: { xs: 150, sm: 200 },
                    height: { xs: 150, sm: 200 },
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <ProgressiveImage
                    src={attachment.url}
                    alt={attachment.fileName}
                    width="100%"
                    height="100%"
                  />
                </Box>
              ) : (
                <Typography
                  key={index}
                  variant="caption"
                  role="listitem"
                  aria-label={`File: ${attachment.fileName}`}
                  sx={{
                    bgcolor: "rgba(64, 169, 255, 0.1)",
                    color: "#40a9ff",
                    px: { xs: 0.75, sm: 1 },
                    py: 0.25,
                    borderRadius: "full",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {attachment.fileName}
                </Typography>
              )
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

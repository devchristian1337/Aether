import React, { useState, DragEvent, Suspense } from "react";
import { Message, ChatState, GeminiError } from "./types";
import { ChatInput } from "./components/ChatInput";
import { CustomButton } from "./components/CustomButton";
import { generateResponse } from "./lib/gemini";
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  formatFileSize,
} from "./lib/utils";
import { AVAILABLE_MODELS, DEFAULT_MODEL, ModelConfig } from "./lib/models";
import { ThemeProvider } from "./contexts/ThemeContext";

// Material-UI Components
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";

// Material-UI Icons
import MessageIcon from "@mui/icons-material/Message";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";

// Lazy load components not needed immediately
const ChatMessage = React.lazy(() => import("./components/ChatMessage"));
const TypingIndicator = React.lazy(
  () => import("./components/TypingIndicator")
);
const ThemeToggle = React.lazy(() => import("./components/ThemeToggle"));
const ClearChatDialog = React.lazy(
  () => import("./components/ClearChatDialog")
);

// Loading fallback component
const LoadingFallback = () => (
  <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
    <CircularProgress />
  </Box>
);

function AppContent() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isTyping: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<ModelConfig>(DEFAULT_MODEL);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<{
    message: string;
    type?: "rate-limit" | "file-size" | "general";
  } | null>(null);

  const handleClearChat = () => {
    setState((prev) => ({
      ...prev,
      messages: [],
      isTyping: false,
    }));
    setFiles([]);
    setShowClearConfirm(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      // Check each file's size
      const oversizedFiles = newFiles.filter(
        (file) => file.size > MAX_FILE_SIZE_BYTES
      );

      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles
          .map((f) => `${f.name} (${formatFileSize(f.size)})`)
          .join(", ");
        setError({
          message: `Files exceeding ${MAX_FILE_SIZE_MB}MB limit: ${fileNames}`,
          type: "file-size",
        });
        event.target.value = ""; // Reset input
        return;
      }

      const totalNewSize = newFiles.reduce((acc, file) => acc + file.size, 0);
      const totalExistingSize = files.reduce((acc, file) => acc + file.size, 0);

      if (totalNewSize + totalExistingSize > MAX_FILE_SIZE_BYTES) {
        setError({
          message: `Total file size would exceed ${MAX_FILE_SIZE_MB}MB limit`,
          type: "file-size",
        });
        event.target.value = ""; // Reset input
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      fileNames: files.map((f) => f.name),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      const response = await generateResponse(content, files, selectedModel);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));

      setFiles([]);
    } catch (error: unknown) {
      const geminiError = error as GeminiError;
      console.error("Error:", geminiError);
      setState((prev) => ({ ...prev, isTyping: false }));

      if (geminiError.message?.includes("quota")) {
        setError({
          message: "API rate limit exceeded. Please try again later.",
          type: "rate-limit",
        });
      } else if (geminiError.message?.includes("size exceeds")) {
        setError({
          message: `File size exceeds limit: ${geminiError.message}`,
          type: "file-size",
        });
      } else {
        setError({
          message:
            "An error occurred while generating the response. Please try again.",
          type: "general",
        });
      }
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if the drag leave event is from the main container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    // Check each file's size
    const oversizedFiles = droppedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE_BYTES
    );

    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles
        .map((f) => `${f.name} (${formatFileSize(f.size)})`)
        .join(", ");
      setError({
        message: `Files exceeding ${MAX_FILE_SIZE_MB}MB limit: ${fileNames}`,
        type: "file-size",
      });
      return;
    }

    const totalNewSize = droppedFiles.reduce((acc, file) => acc + file.size, 0);
    const totalExistingSize = files.reduce((acc, file) => acc + file.size, 0);

    if (totalNewSize + totalExistingSize > MAX_FILE_SIZE_BYTES) {
      setError({
        message: `Total file size would exceed ${MAX_FILE_SIZE_MB}MB limit`,
        type: "file-size",
      });
      return;
    }

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
              py: { xs: 2, sm: 1 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  bgcolor: "primary.main",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageIcon
                  sx={{ color: "white", fontSize: { xs: 24, sm: 28 } }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  Ae
                  <Box component="span" sx={{ color: "primary.main" }}>
                    ther
                  </Box>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  Based on Gemini API
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Suspense fallback={<LoadingFallback />}>
                <ThemeToggle />
              </Suspense>
              <FormControl
                size="small"
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    color: "text.primary",
                    "& fieldset": {
                      borderColor: "divider",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                  "& .MuiSelect-icon": {
                    color: "text.secondary",
                  },
                }}
              >
                <InputLabel
                  id="model-select-label"
                  sx={{ color: "text.secondary" }}
                >
                  Model
                </InputLabel>
                <Select
                  labelId="model-select-label"
                  value={selectedModel.id}
                  label="Model"
                  onChange={(e) => {
                    const model = AVAILABLE_MODELS.find(
                      (m) => m.id === e.target.value
                    );
                    if (model) {
                      setSelectedModel(model);
                    }
                  }}
                >
                  {AVAILABLE_MODELS.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title="Clear all chat messages">
                <span>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setShowClearConfirm(true)}
                    disabled={state.messages.length === 0}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Clear Chat
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Confirmation Dialog */}
      <Suspense fallback={<LoadingFallback />}>
        <ClearChatDialog
          open={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleClearChat}
        />
      </Suspense>

      {/* Main Chat Area */}
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          sx={{
            flex: 1,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            borderRadius: { xs: 2, sm: 3 },
            overflow: "hidden",
            position: "relative",
            transition: "all 0.2s ease-in-out",
            ...(isDragging && {
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 10,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: "12px",
                left: "12px",
                right: "12px",
                bottom: "12px",
                border: "3px dashed",
                borderColor: "primary.main",
                borderRadius: "inherit",
                zIndex: 11,
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              },
              "@keyframes pulse": {
                "0%, 100%": {
                  opacity: 1,
                },
                "50%": {
                  opacity: 0.5,
                },
              },
            }),
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isDragging && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 12,
                textAlign: "center",
                color: "white",
                width: "100%",
                maxWidth: "400px",
                mx: "auto",
                p: 4,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: 3,
                  p: 4,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <AttachFileIcon
                  sx={{
                    fontSize: 64,
                    mb: 2,
                    animation: "bounce 2s infinite",
                    "@keyframes bounce": {
                      "0%, 20%, 50%, 80%, 100%": {
                        transform: "translateY(0)",
                      },
                      "40%": {
                        transform: "translateY(-20px)",
                      },
                      "60%": {
                        transform: "translateY(-10px)",
                      },
                    },
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    mb: 1,
                    fontWeight: "bold",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Drop files here
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  Maximum {MAX_FILE_SIZE_MB}MB per file
                </Typography>
              </Box>
            </Box>
          )}
          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: { xs: 1.5, sm: 2 },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {state.messages.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  gap: { xs: 1.5, sm: 2 },
                  py: { xs: 4, sm: 6 },
                }}
              >
                <MessageIcon
                  sx={{
                    fontSize: { xs: 36, sm: 48 },
                    color: "text.disabled",
                  }}
                />
                <Typography
                  sx={{
                    textAlign: "center",
                    px: 2,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Start a conversation by typing a message below
                </Typography>
              </Box>
            ) : (
              state.messages.map((message) => (
                <Suspense key={message.id} fallback={<LoadingFallback />}>
                  <ChatMessage message={message} />
                </Suspense>
              ))
            )}
            {state.isTyping && (
              <Suspense fallback={<LoadingFallback />}>
                <TypingIndicator />
              </Suspense>
            )}
          </Box>

          {/* Input Area */}
          <Box sx={{ borderTop: 1, borderColor: "divider", p: 2 }}>
            {files.length > 0 && (
              <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "full",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      opacity: 0.9,
                    }}
                  >
                    <Typography variant="body2">{file.name}</Typography>
                    <Tooltip title="Remove file">
                      <IconButton
                        size="small"
                        onClick={() =>
                          setFiles(files.filter((_, i) => i !== index))
                        }
                        sx={{ color: "inherit", "&:hover": { opacity: 0.8 } }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Tooltip
                title={`Upload files (max ${MAX_FILE_SIZE_MB}MB per file)`}
              >
                <CustomButton
                  component="label"
                  variant="secondary"
                  size="small"
                  sx={{
                    minWidth: "40px",
                    height: "40px",
                    padding: 0,
                  }}
                >
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    aria-label={`Upload files (max ${MAX_FILE_SIZE_MB}MB per file)`}
                  />
                  <AttachFileIcon sx={{ fontSize: "20px" }} />
                </CustomButton>
              </Tooltip>
              <ChatInput onSend={handleSend} disabled={state.isTyping} />
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ py: 2, textAlign: "center", color: "text.secondary" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ userSelect: "none" }}>
            Made by devchristian1337
          </Typography>
          <Tooltip title="View source code on GitHub">
            <IconButton
              component="a"
              href="https://github.com/devchristian1337"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity={error?.type === "rate-limit" ? "warning" : "error"}
          variant="filled"
          sx={{
            width: "100%",
            ...(error?.type === "rate-limit" && {
              bgcolor: "#f59e0b", // Amber color for rate limit warnings
              "& .MuiAlert-icon": {
                color: "white",
              },
            }),
          }}
        >
          {error?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

import { useState, useCallback, useEffect } from "react";
import { IconButton, Tooltip, useTheme, Box } from "@mui/material";
import { Mic as MicIcon, Stop as StopIcon } from "@mui/icons-material";
import type { SpeechRecognition } from "../types/speech";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

const playStartSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.2
  );
  oscillator.stop(audioContext.currentTime + 0.2);
};

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const theme = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        // Set to empty string for automatic language detection
        recognition.lang = "";

        recognition.onresult = (event) => {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript;

          if (lastResult.isFinal) {
            onTranscript(transcript.trim());
            stopListening();
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setError(event.error);
          stopListening();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      } else {
        setError("Speech recognition is not supported in this browser.");
      }
    }
  }, [onTranscript]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        setError("");
        playStartSound();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setError("Failed to start speech recognition.");
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip
        title={
          error
            ? error
            : isListening
            ? "Stop listening"
            : disabled
            ? "Voice input disabled"
            : "Start voice input (automatic language detection)"
        }
      >
        <span>
          <IconButton
            onClick={isListening ? stopListening : startListening}
            disabled={disabled || !!error}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            sx={{
              color: isListening
                ? theme.palette.error.main
                : theme.palette.primary.main,
              backgroundColor: isListening
                ? theme.palette.error.main + "14"
                : theme.palette.primary.main + "14",
              "&:hover": {
                backgroundColor: isListening
                  ? theme.palette.error.main + "24"
                  : theme.palette.primary.main + "24",
              },
              transition: "all 0.2s ease-in-out",
              animation: isListening ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.2)",
                },
                "70%": {
                  transform: "scale(1.05)",
                  boxShadow: "0 0 0 10px rgba(0, 0, 0, 0)",
                },
                "100%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
                },
              },
            }}
          >
            {isListening ? <StopIcon /> : <MicIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}

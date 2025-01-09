import { Box } from "@mui/material";
import { TextShimmer } from "./ui/text-shimmer";

/**
 * A component that displays an animated typing indicator when the assistant is processing a response.
 * Uses TextShimmer for the animation effect and adapts to the current theme.
 * 
 * @component
 * @returns {JSX.Element} An animated typing indicator
 */
const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <TextShimmer
        className="text-sm sm:text-base [--base-color:#71717a] [--base-gradient-color:#18181b] dark:[--base-color:#a1a1aa] dark:[--base-gradient-color:#ffffff]"
        duration={1}
      >
        Assistant is typing
      </TextShimmer>
    </Box>
  );
};

export default TypingIndicator;

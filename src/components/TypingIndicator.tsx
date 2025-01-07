import { Box } from "@mui/material";

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        p: { xs: 1.5, sm: 2 },
        color: "text.secondary",
      }}
    >
      <Box component="span" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
        Assistant is typing
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            component="span"
            sx={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "text.secondary",
              animation: "typingAnimation 1.4s infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes typingAnimation": {
                "0%, 60%, 100%": {
                  transform: "translateY(0)",
                  opacity: 0.4,
                },
                "30%": {
                  transform: "translateY(-4px)",
                  opacity: 1,
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingIndicator;

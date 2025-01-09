# AI Chat Application with File Support

![Aether Preview](https://iili.io/2gsWOiu.png)

A modern React-based chat application that leverages Google's Generative AI (Gemini) for intelligent conversations. Built with TypeScript, Material-UI, and TailwindCSS, featuring file upload capabilities and a sleek user interface.

## Features

- 💬 Real-time chat interface with AI responses
- 📁 File upload support (drag & drop or click to upload)
- 🎨 Modern UI with Material-UI components
- 🌙 Dark mode interface
- ⚡ Built with Vite for optimal performance
- 🔒 File size limits and validations
- 💅 Styled with TailwindCSS and Material-UI
- 📝 Markdown support for messages
- 🔄 Loading states and typing indicators

## Tech Stack

- React
- TypeScript
- Vite
- Material-UI
- TailwindCSS
- Google Generative AI (Gemini)
- Radix UI Components
- Emotion
- Framer Motion
- Date-fns
- React Markdown

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/                 # React components
│   ├── ChatMessage.tsx         # Message component
│   ├── ChatInput.tsx           # Input component
│   ├── CodeBlock.tsx           # Code block component
│   ├── TypingIndicator.tsx     # Typing indicator component
│   └── ui/                     # Shared UI components
│       ├── button.tsx          # Button component
│       ├── button-variants.ts  # Button styling variants
│       ├── dialog.tsx          # Dialog component
│       ├── flickering-grid.tsx # Grid animation component
│       └── text-shimmer.tsx    # Text animation component
├── contexts/                   # React contexts
│   └── ThemeContext.tsx        # Theme context provider
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions and API
├── types/                      # TypeScript type definitions
│   ├── chat.ts                 # Chat-related types
│   └── theme.ts                # Theme-related types
├── App.tsx                     # Main application component
├── index.css                   # Global styles
├── main.tsx                    # Application entry point
├── theme.ts                    # Theme configuration
└── types.ts                    # Global type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Features in Detail

### Chat Interface
- Real-time conversation with AI
- Markdown rendering support
- Timestamp display for messages
- Typing indicators

### File Handling
- Drag and drop file upload
- Click to upload functionality
- File size validation
- Multiple file support
- File size limits (configurable)

### UI/UX
- Responsive design
- Dark mode
- Loading states
- Error handling with user feedback
- Clean and modern interface

### Additional Features

- 🎭 Framer Motion animations
- 📅 Date formatting with date-fns
- 🎨 Advanced UI components from Radix UI
- ✨ Smooth animations and transitions
- 📝 GitHub-flavored markdown support
- 🔄 Real-time chat updates
- 🎯 TypeScript strict mode enabled
- 📱 Fully responsive design
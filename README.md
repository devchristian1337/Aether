# Aether

![Aether Preview](https://iili.io/2rMvPus.png)

A modern React-based chat application that leverages Google's Generative AI (Gemini) for intelligent conversations. Built with TypeScript, Material-UI, and TailwindCSS, featuring file upload capabilities and a sleek user interface.

## Features

- 💬 Real-time chat interface with AI responses
- 📁 File upload support (drag & drop or click to upload)
- 🎨 Modern UI with Material-UI components and TailwindCSS
- 🌙 Dark mode interface with smooth transitions
- ⚡ Built with Vite for optimal performance
- 🔒 File size limits and validations
- 💅 Styled with TailwindCSS and Material-UI
- 📝 GitHub-flavored Markdown support for messages
- 🔄 Loading states and typing indicators
- 📋 Copy to clipboard functionality for AI responses
- 🖼️ Progressive image loading
- ⌨️ Full keyboard accessibility support
- 🎯 Error handling with user-friendly notifications
- 🔍 Multiple Gemini model options
- 📱 Fully responsive design for all devices

## Available Models

The application supports multiple AI models:

### Gemini Models

- **Gemini 2.0 Flash** (Default) - Latest flash model
- **Gemini Experimental 1206** - Experimental model from December 2023
- **Gemini 2.0 Flash Thinking** - Experimental thinking-optimized model
- **Gemini 2.0 Pro** - Latest Gemini 2.0 Pro experimental model

### Other Models

- **Llama 3.2** - Meta's Llama 3.2 3B model optimized for instruction following
- **Qwen 2.5 Coder** - Qwen 2.5 32B model optimized for coding tasks
- **DeepSeek V3** - DeepSeek's latest V3 model for general-purpose tasks

Model capabilities vary:

- Gemini models support up to 32,768 tokens
- Llama 3.2 and DeepSeek V3 support up to 131,072 context length with 4,096 max tokens
- Qwen 2.5 Coder has 512 tokens for both context and output

## Tech Stack

- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- TailwindCSS
- Google Generative AI (Gemini)
- Radix UI Components
- Emotion
- Framer Motion
- Date-fns
- React Markdown with GFM support

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
VITE_GEMINI_API_KEY=your_api_key_here      <!--  https://aistudio.google.com/apikey   -->
VITE_HYPERBOLIC_API_KEY=your_api_key_here  <!--  https://app.hyperbolic.xyz/settings  -->
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
├── components/                # React components
│   ├── ChatMessage.tsx        # Message component with markdown support
│   ├── ChatInput.tsx          # Input component with file upload
│   ├── ProgressiveImage.tsx   # Image loading component
│   ├── TypingIndicator.tsx    # Typing animation component
│   └── ui/                    # Shared UI components
│       ├── button.tsx         # Custom button component
│       ├── dialog.tsx         # Modal dialog component
│       └── text-shimmer.tsx   # Text animation component
├── contexts/                  # React contexts
│   └── ThemeContext.tsx       # Theme management
├── lib/                       # Utility functions and API
│   ├── gemini.ts              # Gemini API integration
│   └── models.ts              # Model configurations
├── types/                     # TypeScript type definitions
│   ├── chat.ts                # Chat-related types
│   └── speech.ts              # Speech recognition types
├── App.tsx                    # Main application component
├── index.css                  # Global styles and Tailwind
└── main.tsx                   # Application entry point
```

## Features in Detail

### Chat Interface

- Real-time conversation with AI
- GitHub-flavored Markdown rendering
- Syntax highlighting for code blocks
- Message timestamps
- Typing indicators
- Copy to clipboard functionality
- Error handling with visual feedback

### File Handling

- Drag and drop file upload with visual feedback
- Click to upload functionality
- File size validation (configurable limits)
- Multiple file support
- Progressive image loading
- Supported file types: images, PDFs, docs, text files

### UI/UX Features

- Responsive design for all screen sizes
- Dark mode with smooth transitions
- Loading states with animations
- Error handling with user feedback
- Clean and modern interface
- Keyboard navigation support
- Custom scrollbar styling
- Tooltips for enhanced usability

### Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast text
- Semantic HTML structure

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

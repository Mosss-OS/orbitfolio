# Orbitfolio

A modern portfolio landing page featuring a 3D interactive globe, data visualization, and responsive UI. Built with cutting-edge web technologies.

## Features

- **3D Interactive Globe** - Built with React Three Fiber and Three.js, featuring a beautiful interactive globe visualization
- **Data Visualization** - Beautiful charts using Recharts for displaying stats and metrics
- **Responsive Design** - Fully responsive layout using Tailwind CSS
- **Modern UI Components** - Built with Radix UI primitives styled with Tailwind
- **TypeScript** - Fully typed codebase for better developer experience
- **Vite** - Fast development and build tooling
- **Framer Motion** - Smooth animations throughout the application

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Three Fiber / Three.js
- Radix UI
- Recharts
- Framer Motion

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # UI components (shadcn-ui style)
│   ├── Globe3D.tsx  # 3D globe component
│   ├── HeroSection.tsx
│   ├── StatsBar.tsx
│   ├── HowItWorks.tsx
│   ├── FeaturesSection.tsx
│   ├── CTASection.tsx
│   ├── Footer.tsx
│   └── Navbar.tsx
├── pages/           # Page components
│   ├── Index.tsx
│   ├── Explore.tsx
│   └── NotFound.tsx
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── App.tsx          # Main application
```

## Components

### Globe3D
Interactive 3D globe component using React Three Fiber and Three.js.

### HeroSection
Main hero section with call-to-action and engaging visuals.

### StatsBar
Displays key metrics using data visualization charts.

### HowItWorks
Step-by-step explanation of the project functionality.

### FeaturesSection
Highlights the key features and capabilities.

### CTASection
Call-to-action section for user engagement.

## License

MIT
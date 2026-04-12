# Configuration

This document covers the configuration options available in Orbitfolio.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Orbitfolio
VITE_APP_DESCRIPTION=A modern portfolio landing page
```

## Tailwind Configuration

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.ts`.

## Vite Configuration

Build configuration is in `vite.config.ts`.

### Key Settings

- **Port**: 5173 (default)
- **Build Output**: `dist/`
- **TypeScript**: Strict mode enabled
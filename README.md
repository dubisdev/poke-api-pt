# 🎮 Pokédex App

A modern, interactive Pokédex application built with Next.js 16, featuring comprehensive Pokemon information, advanced filtering, and real-time search capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![React](https://img.shields.io/badge/React-19.2.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.1-38bdf8)

## ✨ Features

- **📋 Complete Pokemon List**: Browse all Pokemon with their names, generations, types, and more
- **🔍 Real-time Search**: Instant search that finds Pokemon and their evolutions as you type
- **🎯 Advanced Filtering**: Filter by type and generation to find exactly what you're looking for
- **📊 Detailed Pokemon Pages**: View comprehensive stats, evolution chains, images, and information for each Pokemon
- **🔗 Interactive Evolution Chains**: Navigate seamlessly between Pokemon evolutions
- **💾 Persistent State**: Filters and search state are preserved when navigating back from detail pages
- **⚡ Performance Optimized**: Built with Next.js 16 App Router and React Server Components
- **✅ Fully Tested**: Comprehensive unit and E2E test coverage

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Validation**: [Valibot](https://valibot.dev/)
- **Testing**:
  - Unit/Integration: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
  - E2E: [Playwright](https://playwright.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js 24+ installed
- pnpm installed (`npm install -g pnpm`)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd poke-api-pt
```

1. Install dependencies:

```bash
pnpm install
```

1. Run the development server:

```bash
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm exec playwright test` - Run E2E tests

## 🧪 Testing

The project includes comprehensive test coverage:

### Unit Tests

```bash
pnpm test
```

Tests cover:

- Filter logic and parsing
- Text formatting utilities
- Component rendering and interactions

### E2E Tests

```bash
pnpm exec playwright test
```

E2E tests validate:

- Pokemon list loading and display
- Search functionality with evolution matching
- Filter interactions (type and generation)
- Navigation to detail pages
- Evolution chain navigation
- State persistence

## 📁 Project Structure

```
poke-api-pt/
├── app/                          # Next.js App Router
│   ├── (home)/                   # Home route group
│   │   ├── page.tsx             # Main Pokemon list page
│   │   ├── components/          # Home page components
│   │   ├── hooks/               # Custom hooks for filtering
│   │   └── utils/               # Filter and parsing utilities
│   ├── pokemon/[id]/            # Dynamic Pokemon detail pages
│   │   ├── page.tsx             # Detail page
│   │   └── components/          # Detail page components
│   └── components/              # Shared components
├── lib/                         # Core utilities and API
│   ├── pokemon-api.ts          # Pokemon API client
│   ├── schemas.ts              # Valibot schemas
│   ├── types.ts                # TypeScript types
│   └── consts.ts               # Constants
├── e2e/                        # Playwright E2E tests
└── __tests__/                  # Unit tests (colocated)
```

## 🎯 Key Features Implementation

### Search with Evolution Matching

When searching for a Pokemon, the app intelligently finds not only the Pokemon itself but also its entire evolution chain. For example, searching for "Pikachu" will also show Pichu and Raichu.

### Smart Filtering

- **Type Filter**: Filter Pokemon by their primary or secondary types
- **Generation Filter**: Browse Pokemon from specific generations
- **Combined Filters**: All filters work together seamlessly

### State Persistence

Navigation state, including search terms and filter selections, is maintained when you navigate to a Pokemon detail page and return to the list.

### Server Components

The app leverages React Server Components for optimal performance, fetching Pokemon data on the server and minimizing client-side JavaScript.

## 🌐 API

This project uses the [PokéAPI](https://pokeapi.co/) to fetch Pokemon data including:

- Basic Pokemon information
- Evolution chains
- Stats and abilities
- Sprites and images

## 📄 License

This is a technical assessment project.

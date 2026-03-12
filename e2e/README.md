# End-to-End Tests

This directory contains Playwright E2E tests that verify the application meets all requirements from the [base specification](../base-spec.md).

## Test Coverage

### 1. Pokémon Listing (Spec #1)

- ✅ Displays all Pokémon with name, generation, and types
- ✅ Pokémon are ordered by ID
- ✅ Shows complete information for each Pokémon card

### 2. Filters (Spec #2)

- ✅ Filter by Pokémon type (e.g., Fire, Water, Grass)
- ✅ Filter by generation (1-9)
- ✅ Combine multiple filters (type + generation)

### 3. Search by Name (Spec #3)

- ✅ Real-time search as user types
- ✅ Includes evolution line in search results
  - Example: Searching "Pikachu" shows Pichu, Pikachu, and Raichu
- ✅ Updates results dynamically

### 4. Pokémon Detail Page (Spec #4)

- ✅ Displays complete information:
  - Name
  - Image
  - Generation
  - Types
  - Evolution chain with images
  - Stats (HP, Attack, Defense, etc.)
- ✅ Navigate between evolutions
- ✅ Current evolution is visually marked
- ✅ Back navigation maintains filter/search state

### 5. Navigation and User Experience

- ✅ Loading states
- ✅ Error handling (invalid Pokémon IDs)
- ✅ Responsive design (mobile viewport)

## Running Tests

### Configuration

The tests are configured with extended timeouts to handle the Pokémon data loading:

- **Global timeout**: 60 seconds per test
- **Action timeout**: 15 seconds for interactions
- **Navigation timeout**: 30 seconds for page loads
- **Expect timeout**: 10 seconds for assertions

Tests use `waitUntil: 'networkidle'` to ensure all Pokémon data is loaded before interactions.

### Prerequisites

Make sure the development server is running:

```bash
pnpm dev
```

### Run all tests

```bash
pnpm exec playwright test
```

### Run tests in UI mode (interactive)

```bash
pnpm exec playwright test --ui
```

### Run specific test file

```bash
pnpm exec playwright test e2e/pokemon-app.spec.ts
```

### Run tests in headed mode (see browser)

```bash
pnpm exec playwright test --headed
```

### Run specific test by name

```bash
pnpm exec playwright test -g "includes evolutions in search results"
```

### Generate test report

```bash
pnpm exec playwright show-report
```

## Test Structure

Tests are organized by specification requirements:

- **Pokémon Listing** - Home page display and ordering
- **Filters** - Type and generation filtering
- **Search by name** - Real-time search with evolutions
- **Pokémon Detail Page** - Individual Pokémon information and navigation
- **Navigation and UX** - Error handling, responsive design

## Debugging Tests

### Run with debug mode

```bash
pnpm exec playwright test --debug
```

### Use Playwright Inspector

```bash
PWDEBUG=1 pnpm exec playwright test
```

### Visual debugging with trace viewer

```bash
pnpm exec playwright test --trace on
pnpm exec playwright show-trace trace.zip
```

## CI/CD Integration

Tests are configured to run in CI environments. The `playwright.config.ts` contains settings for:

- Headless mode by default
- Screenshot on failure
- Video recording on first retry
- Multiple browser engines (Chromium, Firefox, WebKit)

## Adding New Tests

1. Open `e2e/pokemon-app.spec.ts`
2. Add tests within relevant `test.describe` blocks
3. Use data-testid attributes for reliable element selection
4. Follow existing patterns for consistency

### Available Test IDs

- `data-testid="pokemon-card"` - Individual Pokémon cards
- `data-testid="pokemon-id"` - Pokémon ID number
- `data-testid="type-badge"` - Type badges
- `data-testid="evolution-chain"` - Evolution chain section
- `data-current="true"` - Current evolution indicator

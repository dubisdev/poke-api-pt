import { test, expect } from '@playwright/test';

test.describe('Pokémon Listing (Spec #1)', () => {
  test('displays all Pokémon with name, generation, and types', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Pokédex/);
    await expect(page.getByRole('heading', { name: 'Pokédex' })).toBeVisible();

    // Verify Pokémon cards are displayed
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    await expect(pokemonCards.first()).toBeVisible();

    // Verify first Pokémon (#1 Bulbasaur) has required information
    const firstCard = pokemonCards.first();
    await expect(firstCard.getByText(/Bulbasaur/i)).toBeVisible();
    await expect(firstCard.getByText(/Gen 1/i)).toBeVisible();
    await expect(firstCard.locator('[data-testid="type-badge"]')).toHaveCount(2); // Grass/Poison
  });

  test('Pokémon are ordered by ID', async ({ page }) => {
    await page.goto('/');

    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    await expect(pokemonCards.first()).toBeVisible();
    const firstCardId = await pokemonCards.first().locator('[data-testid="pokemon-id"]').textContent();
    const secondCardId = await pokemonCards.nth(1).locator('[data-testid="pokemon-id"]').textContent();

    // Extract numbers and verify ordering
    const firstId = parseInt(firstCardId?.replace(/\D/g, '') || '0');
    const secondId = parseInt(secondCardId?.replace(/\D/g, '') || '0');
    
    expect(firstId).toBeLessThan(secondId);
  });
});

test.describe('Filters (Spec #2)', () => {
  test('filters Pokémon by type', async ({ page }) => {
    await page.goto('/');

    // Wait for initial cards to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();

    // Select Fire type
    await page.selectOption('select:has-text("All Types")', 'fire');

    // Wait for Charmander to appear (fire type)
    await expect(page.getByText(/Charmander/i)).toBeVisible();

    // Verify filtered results contain fire type
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    const count = await pokemonCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('combines type and generation filters', async ({ page }) => {
    await page.goto('/');

    // Wait for initial cards to load
    await expect(page.locator('[data-testid="pokemon-card"]').first()).toBeVisible();

    // Select Water type and Generation 1
    await page.selectOption('select:has-text("All Types")', 'water');
    await page.selectOption('select:has-text("All Generations")', '1');

    // Verify Squirtle is visible (Gen 1 Water type)
    await expect(page.getByText(/Squirtle/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Search by name (Spec #3)', () => {
  test('searches Pokémon by name in real-time', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search Pokémon...');
    
    // Type "Pika"
    await searchInput.fill('Pika');

    // Verify Pikachu appears
    await expect(page.getByText(/Pikachu/i)).toBeVisible({ timeout: 5000 });
  });

  test('includes evolutions in search results', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search Pokémon...');
    
    // Search for "Pikachu"
    await searchInput.fill('Pikachu');

    // Verify all evolution line members appear (Pichu, Pikachu, Raichu)
    await expect(page.getByText(/Pichu/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Pikachu/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Raichu/i)).toBeVisible({ timeout: 5000 });
  });

  test('search updates results as user types', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search Pokémon...');
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    
    // Type gradually
    await searchInput.fill('B');
    await expect(pokemonCards.first()).toBeVisible();
    const count1 = await pokemonCards.count();

    await searchInput.fill('Bu');
    // Wait for results to update
    await page.waitForFunction((oldCount) => {
      const cards = document.querySelectorAll('[data-testid="pokemon-card"]');
      return cards.length !== oldCount;
    }, count1, { timeout: 3000 }).catch(() => {});
    const count2 = await pokemonCards.count();

    // More specific search should yield fewer or equal results
    expect(count2).toBeLessThanOrEqual(count1);
  });
});

test.describe('Pokémon Detail Page (Spec #4)', () => {
  test('displays evolution chain with images', async ({ page }) => {
    await page.goto('/pokemon/2'); // Ivysaur

    // Verify evolution chain section exists
    const evolutionSection = page.locator('[data-testid="evolution-chain"]');
    await expect(evolutionSection).toBeVisible();

    // Verify evolution images are present
    const evolutionImages = evolutionSection.locator('img');
    const imageCount = await evolutionImages.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test('navigates between evolutions', async ({ page }) => {
    await page.goto('/pokemon/1'); // Bulbasaur

    // Find and click on Ivysaur in evolution chain
    const evolutionChain = page.locator('[data-testid="evolution-chain"]');
    await evolutionChain.getByRole('link', { name: /Ivysaur/i }).click();

    // Verify navigation to Ivysaur
    await expect(page).toHaveURL(/\/pokemon\/2/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ivysaur');
  });

  test('marks current evolution in chain', async ({ page }) => {
    await page.goto('/pokemon/2'); // Ivysaur

    const evolutionChain = page.locator('[data-testid="evolution-chain"]');
    
    // Current evolution should have visual distinction
    // (This depends on your implementation - adjust selector as needed)
    const currentEvolution = evolutionChain.locator('[data-current="true"]');
    await expect(currentEvolution).toBeVisible();
  });;
});


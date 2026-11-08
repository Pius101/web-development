import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await expect(page.locator('#hero-title')).toContainText('Discover Malaysia\'s Plant Biodiversity');
  await expect(page.locator('#hero')).toContainText('Explore Malaysia\'s diverse plants, learn how families, genera and species are connected, and help support biodiversity awareness through citizen science.');
  await expect(page.locator('#hero')).toContainText('Citizen Science • Malaysian Biodiversity');
  await page.getByRole('link', { name: 'Explore plants', exact: true }).click();
  await page.goto('http://localhost:8000/');
  await page.getByRole('link', { name: '02 Genera Compare four genera' }).click();
  await page.getByRole('link', { name: '03 Species Reach eight' }).click();
  await page.getByRole('link', { name: 'Open Explorer →' }).click();
  await page.getByRole('heading', { name: 'Identify' }).click();
  await page.getByRole('link', { name: 'Identify a plant →' }).click();
  await page.getByText('Contribute Share a plant name').click();
  await page.getByRole('link', { name: 'Add an observation →' }).click();
});
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:8000/');
  await page.getByRole('link', { name: 'Malaysia Plant Biodiversity' }).click();
  await page.getByText('Explore ▾').click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contribute' }).click();
  await page.getByRole('link', { name: 'Enquiry' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contribute' }).click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contributors' }).click();
});
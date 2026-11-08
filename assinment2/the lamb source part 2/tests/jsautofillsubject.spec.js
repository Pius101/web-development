import { test, expect } from '@playwright/test';

test('families', async ({ page }) => {
  await page.goto('http://localhost:8000/families.html');
  await page.locator('#dipterocarpaceae').getByRole('link', { name: 'Ask about this family' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Family: dipterocarpaceae');


  await page.goto('http://localhost:8000/families.html');
  await page.locator('#myristicaceae').getByRole('link', { name: 'Ask about this family' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Family:  Myristicaceae');
});


test('genera', async ({ page }) => {
  await page.goto('http://localhost:8000/genera.html');
  await page.locator('#dipterocarpus').getByRole('link', { name: 'Ask about this genera' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Genus: dipterocarpus');


  await page.goto('http://localhost:8000/genera.html');
  await page.locator('#vatica').getByRole('link', { name: 'Ask about this genera' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Genus:  vatica');
});

test('species', async ({ page }) => {
  await page.goto('http://localhost:8000/species.html');
  await page.locator('#dipterocarpus-grandiflorus').getByRole('link', { name: 'Enquire about this plant' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Horsfieldia penangiana');

  await page.goto('http://localhost:8000/species.html');
  await page.locator('#dipterocarpus-kunstleri').getByRole('link', { name: 'Enquire about this plant' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Dipterocarpus kunstleri');

  await page.goto('http://localhost:8000/species.html');
  await page.locator('#vatica-borneensis').getByRole('link', { name: 'Enquire about this plant' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Vatica borneensis');

  await page.goto('http://localhost:8000/species.html');
  await page.locator('#horsfieldia-penangiana').getByRole('link', { name: 'Enquire about this plant' }).click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Horsfieldia penangiana');

  await page.goto('http://localhost:8000/species.html');
  await page.locator('#knema-communis > .plant-card-body > a').click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Knema communis');

  await page.goto('http://localhost:8000/species.html');
  await page.locator('#knema-mandaharan > .plant-card-body > a').click();
  await expect(page.getByRole('textbox', { name: 'Subject' })).toHaveValue('RE: Enquiry on Knema mandaharan');
});
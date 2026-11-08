import { test, expect } from '@playwright/test';
//test.describe.configure({ mode: 'parallel' });
test('explore dropdown test', async ({ page }) => {
  await page.goto('http://localhost:8000/species.html')

  //drop down menu test 
  //family page test
  await page.getByRole('navigation', { name: 'Main navigation' }).getByText('Explore ▾').hover();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Families', exact: true }).click()
  await expect(page).toHaveURL(/families\.html$/);

  //genus page test
  await page.getByRole('navigation', { name: 'Main navigation' }).getByText('Explore ▾').hover();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Genera', exact: true }).click();
  await expect(page).toHaveURL(/genera\.html$/);

  //species page test
  await page.getByRole('navigation', { name: 'Main navigation' }).getByText('Explore ▾').hover();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Species', exact: true }).click();
  await expect(page).toHaveURL(/species\.html$/);

});

test('the rest of navigation test ', async ({ page }) => {

  await page.goto('http://localhost:8000/species.html');

  //drop down menu test 
  //family page test
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Identify' }).click();
  await expect(page).toHaveURL(/identify\.html$/);

  //genus page test
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contribute' }).click();
  await expect(page).toHaveURL(/contribute\.html$/);

  //species page test
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contributors' }).click();
  await expect(page).toHaveURL(/contributor\.html$/);

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Identify' }).click();
  await expect(page).toHaveURL(/identify\.html$/);


  await page.getByRole('link', { name: 'Enquiry' }).click();
  await expect(page).toHaveURL(/enquiry\.html$/);

  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL(/profile\.html$/);

  await page.getByRole('link', { name: 'Enhancements' }).click();
  await expect(page).toHaveURL(/enhancement1\.html$/);

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Acknowledgement' }).click();
  await expect(page).toHaveURL(/acknowledgement\.html$/);

});
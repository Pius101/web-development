
const { By, Builder, Browser } = require('selenium-webdriver');
const assert = require('assert');

(async function firstTest() {
    let driver;

    try {
        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .build();

        console.log('Starting Selenium test...\n');

        await driver.get(
            'https://www.selenium.dev/selenium/web/web-form.html'
        );

        // TEST 1: Check the page title
        let title = await driver.getTitle();
        assert.equal(title, 'Web form');
        console.log('PASS: Page title is correct');

        await driver.manage().setTimeouts({ implicit: 500 });

        // Find elements
        let textBox = await driver.findElement(By.name('my-text'));
        let submitButton = await driver.findElement(By.css('button'));

        // TEST 2: Enter text
        await textBox.sendKeys('Selenium');

        let inputValue = await textBox.getAttribute('value');
        assert.equal(inputValue, 'Selenium');
        console.log('PASS: Text entered correctly');

        // TEST 3: Submit form
        await submitButton.click();

        let message = await driver.findElement(By.id('message'));
        let value = await message.getText();

        assert.equal(value, 'Received!');
        console.log('PASS: Form submitted successfully');

        console.log('\nALL TESTS PASSED!');

    } catch (e) {
        console.error('\nTEST FAILED:', e);
        process.exitCode = 1;

    } finally {
        if (driver) {
            await driver.quit();
        }
    }
})();

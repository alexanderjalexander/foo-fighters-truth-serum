const {Browser, Builder, By, until} = require("selenium-webdriver");
const path = require("path");

let driver;

beforeAll(async () => {
    process.env.DATABASE = 'TEST_DB';
})

jest.setTimeout(10000);

describe('Chrome', () => {
    test('Renders Home Title', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.manage().deleteCookie('sessionCookie');
        await driver.get('http://localhost:3000');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        let header = await driver.findElement(By.id('home-title'));
        let header_text = await header.getText();
        expect(header_text).toBe('Truth Serum EEG');

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Renders Home Buttons', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        await driver.findElement(By.id('homeRegisterButton'));
        await driver.findElement(By.id('homeLoginButton'));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Renders Login Page Fields', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/login');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        await driver.findElement(By.id('loginHeader'));
        await driver.findElement(By.id('inputEmail'));
        await driver.findElement(By.id('inputPassword'));
        await driver.findElement(By.id('registerRedirect'));
        await driver.findElement(By.id('loginButton'));
        await driver.findElement(By.id('backButton'));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Renders Register Page Fields', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/register');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        await driver.findElement(By.id('registerHeader'));
        await driver.findElement(By.id('inputEmail'));
        await driver.findElement(By.id('inputPassword'));
        await driver.findElement(By.id('loginRedirect'));
        await driver.findElement(By.id('registerButton'));
        await driver.findElement(By.id('backButton'));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Registration and Login Success', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/register');
        await driver.manage().setTimeouts({implicit: 500});

        // Define the Testing Email and Password
        const crypto = require("crypto");
        const id = crypto.randomBytes(4).toString('hex');
        const test_email = 'test' + id + '@gmail.com';
        const test_password = 'Stevens42!';

        // Registration Test Code
        await driver.findElement(By.id('inputEmail')).sendKeys(test_email)
        await driver.findElement(By.id('inputPassword')).sendKeys(test_password)
        await driver.findElement(By.id('registerButton')).click();
        await driver.wait(until.elementLocated(By.id('loginHeader')));

        // Login Test Code
        await driver.findElement(By.id('inputEmail')).sendKeys(test_email)
        await driver.findElement(By.id('inputPassword')).sendKeys(test_password)
        await driver.findElement(By.id('loginButton')).click();
        await driver.wait(until.elementLocated(By.id('dashboardHeader')));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Dashboard Adding Users', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/register');
        await driver.manage().setTimeouts({implicit: 500});

        // Define the Testing Email and Password
        const crypto = require("crypto");
        const id = crypto.randomBytes(4).toString('hex');
        const test_email = 'test' + id + '@gmail.com';
        const test_password = 'Stevens42!';

        // Registration Test Code
        await driver.findElement(By.id('inputEmail')).sendKeys(test_email)
        await driver.findElement(By.id('inputPassword')).sendKeys(test_password)
        await driver.findElement(By.id('registerButton')).click();
        await driver.wait(until.elementLocated(By.id('loginHeader')));

        // Login Test Code
        await driver.findElement(By.id('inputEmail')).sendKeys(test_email)
        await driver.findElement(By.id('inputPassword')).sendKeys(test_password)
        await driver.findElement(By.id('loginButton')).click();
        await driver.wait(until.elementLocated(By.id('dashboardHeader')));

        // Inputting People Tests
        await driver.wait(until.elementLocated(By.id('addPersonButton')));
        let addPersonButton = await driver.findElement(By.id('addPersonButton'));
        await addPersonButton.click();

        await driver.wait(until.elementLocated(By.id('inputPersonName')));
        let inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User1');

        await driver.wait(until.elementLocated(By.id('addPersonSubmit')));
        let addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('User1')));

        await addPersonButton.click();
        inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User2');
        addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('User2')));

        await addPersonButton.click();
        inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User3');
        addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('User3')));

        // Testing Duplicate User Input
        await addPersonButton.click();
        inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User1');
        addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('addError')));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Person Adding Detections', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/register');
        await driver.manage().setTimeouts({implicit: 500});

        // Define the Testing Email and Password
        const crypto = require("crypto");
        const id = crypto.randomBytes(4).toString('hex');
        const test_email = 'test' + id + '@gmail.com';
        const test_password = 'Stevens42!';

        // Registration Test Code
        await driver.findElement(By.id('inputEmail')).sendKeys(test_email)
        await driver.findElement(By.id('inputPassword')).sendKeys(test_password)
        await driver.findElement(By.id('registerButton')).click();
        await driver.wait(until.elementLocated(By.id('loginHeader')));

        // Login Test Code
        await driver.findElement(By.id('inputEmail')).sendKeys(test_email)
        await driver.findElement(By.id('inputPassword')).sendKeys(test_password)
        await driver.findElement(By.id('loginButton')).click();
        await driver.wait(until.elementLocated(By.id('dashboardHeader')));
        await driver.wait(until.elementLocated(By.id('peopleHeader')));

        // Inputting User1 Person
        await driver.wait(until.elementLocated(By.id('addPersonButton')));
        await driver.findElement(By.id('addPersonButton')).click();

        await driver.wait(until.elementLocated(By.id('inputPersonName')));
        await driver.findElement(By.id('inputPersonName')).sendKeys('User1');

        await driver.wait(until.elementLocated(By.id('addPersonSubmit')));
        await driver.findElement(By.id('addPersonSubmit')).click();

        // Wait Until User Appears
        await driver.wait(until.elementLocated(By.id('User1')));
        await driver.findElement(By.id('User1')).click();

        // Checking We're In Detection Page
        await driver.wait(until.elementLocated(By.id('personHeader')));
        await driver.wait(until.elementLocated(By.id('detectionsHeader')));

        // Testing Lie Input
        const detection_lie = path.resolve('./src/test/test_detection_lie.csv');

        await driver.findElement(By.id('addDetectionButton')).click();
        await driver.wait(until.elementLocated(By.id('inputDetectionName')));
        await driver.findElement(By.id('inputDetectionName')).sendKeys('LieTest');
        await driver.findElement(By.id('inputDetectionFile')).sendKeys(detection_lie);
        await driver.findElement(By.id('addDetectionSubmit')).click();

        await driver.wait(until.elementLocated(By.id('LieTest Result')));
        let lie_result = await driver.findElement(By.id('LieTest Result')).getText();
        expect(lie_result).toBe('LIE');

        // Testing Truth Input
        // const detection_truth = path.resolve('./src/test/test_detection_truth.csv');
        //
        // await driver.findElement(By.id('addDetectionButton')).click();
        // await driver.wait(until.elementLocated(By.id('inputDetectionName')));
        // await driver.findElement(By.id('inputDetectionName')).sendKeys('TruthTest');
        // await driver.findElement(By.id('inputDetectionFile')).sendKeys(detection_truth);
        // await driver.findElement(By.id('addDetectionSubmit')).click();
        //
        // await driver.wait(until.elementLocated(By.id('TruthTest Result')));
        // let truth_result = await driver.findElement(By.id('TruthTest Result')).getText();
        // expect(truth_result).toBe('TRUTH');

        // Quitting Selenium Driver
        await driver.quit();
    })
})

jest.setTimeout(15000);

describe('Firefox', () => {
    test('Renders Home Title', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.FIREFOX).build();
        await driver.manage().deleteCookie('sessionCookie');
        await driver.get('http://localhost:3000');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        let header = await driver.findElement(By.id('home-title'));
        let header_text = await header.getText();
        expect(header_text).toBe('Truth Serum EEG');

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Renders Home Buttons', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.FIREFOX).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        await driver.findElement(By.id('homeRegisterButton'));
        await driver.findElement(By.id('homeLoginButton'));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Renders Login Page Fields', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.FIREFOX).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/login');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        await driver.findElement(By.id('loginHeader'));
        await driver.findElement(By.id('inputEmail'));
        await driver.findElement(By.id('inputPassword'));
        await driver.findElement(By.id('registerRedirect'));
        await driver.findElement(By.id('loginButton'));
        await driver.findElement(By.id('backButton'));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Renders Register Page Fields', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.FIREFOX).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/register');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        await driver.findElement(By.id('registerHeader'));
        await driver.findElement(By.id('inputEmail'));
        await driver.findElement(By.id('inputPassword'));
        await driver.findElement(By.id('loginRedirect'));
        await driver.findElement(By.id('registerButton'));
        await driver.findElement(By.id('backButton'));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Registration and Login Success', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.FIREFOX).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/register');
        await driver.manage().setTimeouts({implicit: 500});

        // Define the Testing Email and Password
        const crypto = require("crypto");
        const id = crypto.randomBytes(4).toString('hex');
        const test_email = 'test' + id + '@gmail.com';
        const test_password = 'Stevens42!';

        // Registration Test Code
        let inputEmail = await driver.findElement(By.id('inputEmail'));
        await inputEmail.sendKeys(test_email)
        let inputPassword = await driver.findElement(By.id('inputPassword'));
        await inputPassword.sendKeys(test_password)
        let register = await driver.findElement(By.id('registerButton'));
        await register.click();
        await driver.wait(until.elementLocated(By.id('loginHeader')));

        // Login Test Code
        inputEmail = await driver.findElement(By.id('inputEmail'));
        await inputEmail.sendKeys(test_email)
        inputPassword = await driver.findElement(By.id('inputPassword'));
        await inputPassword.sendKeys(test_password)
        register = await driver.findElement(By.id('loginButton'));
        await register.click();
        await driver.wait(until.elementLocated(By.id('dashboardHeader')));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test('Dashboard Adding Users', async () => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(Browser.FIREFOX).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000/register');
        await driver.manage().setTimeouts({implicit: 500});

        // Define the Testing Email and Password
        const crypto = require("crypto");
        const id = crypto.randomBytes(4).toString('hex');
        const test_email = 'test' + id + '@gmail.com';
        const test_password = 'Stevens42!';

        // Registration Test Code
        let inputEmail = await driver.findElement(By.id('inputEmail'));
        await inputEmail.sendKeys(test_email)
        let inputPassword = await driver.findElement(By.id('inputPassword'));
        await inputPassword.sendKeys(test_password)
        let register = await driver.findElement(By.id('registerButton'));
        await register.click();
        await driver.wait(until.elementLocated(By.id('loginHeader')));

        // Login Test Code
        inputEmail = await driver.findElement(By.id('inputEmail'));
        await inputEmail.sendKeys(test_email)
        inputPassword = await driver.findElement(By.id('inputPassword'));
        await inputPassword.sendKeys(test_password)
        register = await driver.findElement(By.id('loginButton'));
        await register.click();
        await driver.wait(until.elementLocated(By.id('dashboardHeader')));
        await driver.wait(until.elementLocated(By.id('peopleHeader')));

        // Inputting People Tests
        await driver.wait(until.elementLocated(By.id('addPersonButton')));
        let addPersonButton = await driver.findElement(By.id('addPersonButton'));
        await addPersonButton.click();

        await driver.wait(until.elementLocated(By.id('inputPersonName')));
        let inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User1');

        await driver.wait(until.elementLocated(By.id('addPersonSubmit')));
        let addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('User1')));

        await addPersonButton.click();
        inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User2');
        addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('User2')));

        await addPersonButton.click();
        inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User3');
        addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('User3')));

        // Testing Duplicate User Input
        await addPersonButton.click();
        inputName = await driver.findElement(By.id('inputPersonName'));
        await inputName.sendKeys('User1');
        addPersonSubmit = await driver.findElement(By.id('addPersonSubmit'));
        await addPersonSubmit.click();
        await driver.wait(until.elementLocated(By.id('addError')));

        // Quitting Selenium Driver
        await driver.quit();
    });
})

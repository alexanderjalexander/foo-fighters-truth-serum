const {Browser, Builder, By, until} = require("selenium-webdriver");
const path = require("path");
import {expect, jest, test} from '@jest/globals';
import {Select} from "selenium-webdriver";

let driver;

beforeAll(async () => {
    process.env.DATABASE = 'TEST_DB';
})

jest.setTimeout(15000);

const browsers = [Browser.CHROME, Browser.FIREFOX]
// Known Linux Fedora Issue: Tests fail on Firefox

describe('App Render Testing', () => {
    test.each(browsers)('Renders Home Title', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
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

    test.each(browsers)('Renders Home Buttons', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
        await driver.manage().deleteCookie('sessionCookie')
        await driver.get('http://localhost:3000');
        await driver.manage().setTimeouts({implicit: 500});

        // Test Code
        await driver.findElement(By.id('homeRegisterButton'));
        await driver.findElement(By.id('homeLoginButton'));

        // Quitting Selenium Driver
        await driver.quit();
    });

    test.each(browsers)('Renders Login Page Fields', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
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

    test.each(browsers)('Renders Register Page Fields', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
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
})

describe('App Functionality Testing', () => {
    test.each(browsers)('Registration and Login Success', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
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

    test.each(browsers)('Dashboard Adding Users', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
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

    test.each(browsers)('Person Adding Detections', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
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

        await driver.findElement(By.id('Not In A Session')).click();
        await driver.wait(until.elementLocated(By.id('LieTest Result')));
        let lie_elem = await driver.findElement(By.id('LieTest Result'));
        await driver.wait(until.elementIsVisible(lie_elem));
        let lie_result = await driver.findElement(By.id('LieTest Result')).getText();
        expect(lie_result).toBe('LIE');
        await driver.findElement(By.id('LieTest Confidence'));

        // Testing Truth Input
        const detection_truth = path.resolve('./src/test/test_detection_truth.csv');

        await driver.findElement(By.id('addDetectionButton')).click();
        await driver.wait(until.elementLocated(By.id('inputDetectionName')));
        await driver.findElement(By.id('inputDetectionName')).sendKeys('TruthTest');
        await driver.findElement(By.id('inputDetectionFile')).sendKeys(detection_truth);
        await driver.findElement(By.id('addDetectionSubmit')).click();

        await driver.wait(until.elementLocated(By.id('TruthTest Result')));
        let truth_result = await driver.findElement(By.id('TruthTest Result')).getText();
        expect(truth_result).toBe('TRUTH');
        await driver.findElement(By.id('TruthTest Confidence'));

        // Editing Detection Name and Comment
        await driver.findElement(By.id('LieTest')).click();
        await driver.wait(until.elementLocated(By.id('LieTest Edit')));
        await driver.findElement(By.id('LieTest Edit')).click();
        await driver.wait(until.elementLocated(By.id('inputEditDetectionName')));
        await driver.findElement(By.id('inputEditDetectionName')).clear();
        await driver.findElement(By.id('inputEditDetectionName')).sendKeys('LieTestEdit');
        await driver.findElement(By.id('inputEditDetectionComment')).sendKeys('LieTestComment')
        await driver.findElement(By.id('editDetectionSubmit')).click();
        await driver.wait(until.elementLocated(By.id('LieTestEdit Comment')))
        let comment = await driver.findElement(By.id('LieTestEdit Comment')).getText();
        expect(comment).toBe('Comment: LieTestComment');

        // Quitting Selenium Driver
        await driver.quit();
    });

    test.each(browsers)('Person Adding Sessions', async (browser) => {
        // Initializing Drivers for Selenium
        driver = await new Builder().forBrowser(browser).build();
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

        // Testing Session Input
        await driver.findElement(By.id('addSessionButton')).click();
        await driver.wait(until.elementLocated(By.id('inputSessionName')));
        await driver.findElement(By.id('inputSessionName')).sendKeys('Session1');
        await driver.findElement(By.id('addSessionSubmit')).click();
        await driver.findElement(By.id('Session1')).click();

        // Testing Lie Input
        const detection_lie = path.resolve('./src/test/test_detection_lie.csv');

        await driver.findElement(By.id('addDetectionButton')).click();
        await driver.wait(until.elementLocated(By.id('inputDetectionName')));
        await driver.findElement(By.id('inputDetectionName')).sendKeys('LieTest');
        await driver.findElement(By.id('inputDetectionFile')).sendKeys(detection_lie);
        await driver.findElement(By.id('addDetectionSubmit')).click();
        await driver.findElement(By.id('Not In A Session')).click();
        await driver.wait(until.elementLocated(By.id('LieTest Result')));

        // Editing Detection To Have a New Session
        await driver.findElement(By.id('LieTest')).click();
        await driver.wait(until.elementLocated(By.id('LieTest Edit')));
        await driver.findElement(By.id('LieTest Edit')).click();
        await driver.wait(until.elementLocated(By.id('inputEditDetectionName')));
        await driver.findElement(By.id('inputEditDetectionName')).clear();
        await driver.findElement(By.id('inputEditDetectionName')).sendKeys('LieTestEdit');
        await driver.findElement(By.id('inputEditDetectionComment')).sendKeys('LieTestComment')
        let select = await new Select(await driver.findElement(By.id('inputEditDetectionSession')));
        await select.selectByVisibleText('Session1');
        await driver.findElement(By.id('editDetectionSubmit')).click();

        await driver.findElement(By.id('LieTestEdit')).click();
        await driver.wait(until.elementLocated(By.id('LieTestEdit Comment')));
        let commentElem = await driver.findElement(By.id('LieTestEdit Comment'));
        await driver.wait(until.elementIsVisible(commentElem), 2000);
        expect(await commentElem.getText()).toBe('Comment: LieTestComment');

        // Adding New Detection To Session
        const detection_lie_2 = path.resolve('./src/test/test_detection_lie.csv');
        await driver.findElement(By.id('addDetectionButton')).click();
        await driver.wait(until.elementLocated(By.id('inputDetectionName')));
        await driver.findElement(By.id('inputDetectionName')).sendKeys('LieTest2');
        await driver.findElement(By.id('inputDetectionFile')).sendKeys(detection_lie_2);
        select = await new Select(await driver.findElement(By.id('inputDetectionSession')));
        await select.selectByVisibleText('Session1');
        await driver.findElement(By.id('addDetectionSubmit')).click();

        await driver.wait(until.elementLocated(By.id('LieTest2')), 2000);

        // Quitting Selenium Driver
        await driver.quit();
    })
})
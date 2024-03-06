import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import App from '../app';
import userEvent from "@testing-library/user-event";
import {act} from "react-dom/test-utils";

const crypto = require("crypto");
const id = crypto.randomBytes(4).toString('hex');

const test_email = 'test' + id + '@gmail.com';
const test_password = 'Stevens42!';

beforeAll(async () => {
  process.env.DATABASE = 'TEST_DB';
})

test('Renders Home Title', () => {
  render(<App />);
  const headerElement = screen.getByText("Truth Serum EEG");
  expect(headerElement).toBeInTheDocument();
});

test('Renders Home Buttons', () => {
  render(<App />);
  const loginElement = screen.getByText("Log In");
  expect(loginElement).toBeInTheDocument();
  const registerElement = screen.getByText("Register");
  expect(registerElement).toBeInTheDocument();
});

test('Renders Login Page Fields', () => {
  render(<App />);
  fireEvent.click(screen.getByText("Log In"));
  const emailElement = screen.getByText("Email");
  expect(emailElement).toBeInTheDocument();
  const emailBox = screen.getByTestId('inputEmail');
  expect(emailBox).toBeInTheDocument();
  const passwordElement = screen.getByText("Password");
  expect(passwordElement).toBeInTheDocument();
  const passwordBox = screen.getByTestId('inputPassword');
  expect(passwordBox).toBeInTheDocument();
  const buttonElement = screen.getByText("Back");
  expect(buttonElement).toBeInTheDocument();
});

test('Renders Register Page Fields', () => {
  render(<App />);
  fireEvent.click(screen.getByText("Register"));
  const emailElement = screen.getByText("Email");
  expect(emailElement).toBeInTheDocument();
  const emailBox = screen.getByTestId('inputEmail');
  expect(emailBox).toBeInTheDocument();
  const passwordElement = screen.getByText("Password");
  expect(passwordElement).toBeInTheDocument();
  const passwordBox = screen.getByTestId('inputPassword');
  expect(passwordBox).toBeInTheDocument();
  const buttonElement = screen.getByText("Back");
  expect(buttonElement).toBeInTheDocument();
});

test('Register Success', async () => {
  render(<App/>);
  const header = screen.getByTestId("registerHeader");
  expect(header).toBeInTheDocument();
  const emailBox = screen.getByTestId('inputEmail');
  const passwordBox = screen.getByTestId('inputPassword');
  const registerButton = screen.getByTestId('registerButton');
  await act(() => {
    userEvent.click(emailBox);
    userEvent.keyboard(test_email);
    userEvent.click(passwordBox);
    userEvent.keyboard(test_password);
    userEvent.click(registerButton);
  });
  expect(await screen.findByTestId("loginHeader")).toBeInTheDocument();
})

test('Login Success', async () => {
  render(<App/>);
  const header = screen.getByTestId("loginHeader");
  expect(header).toBeInTheDocument();
  const emailBox = screen.getByTestId('inputEmail');
  const passwordBox = screen.getByTestId('inputPassword');
  const loginButton = screen.getByTestId('loginButton');
  await act(() => {
    userEvent.click(emailBox);
    userEvent.keyboard(test_email);
    userEvent.click(passwordBox);
    userEvent.keyboard(test_password);
    userEvent.click(loginButton);
  });
  expect(await screen.findByText("Welcome!")).toBeInTheDocument();
})
import {fireEvent, render, screen} from '@testing-library/react';
import App from './app';

test('Renders Home Title', () => {
  render(<App />);
  const headerElement = screen.getByText("Foo Fighters EEG");
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
  const usernameElement = screen.getByText("Username");
  expect(usernameElement).toBeInTheDocument();
  const usernameBox = screen.getByRole('textbox', {name: 'Username Box'});
  expect(usernameBox).toBeInTheDocument();
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
  const usernameElement = screen.getByText("Username");
  expect(usernameElement).toBeInTheDocument();
  const usernameBox = screen.getByRole('textbox', {name: 'Username Box'});
  expect(usernameBox).toBeInTheDocument();
  const passwordElement = screen.getByText("Password");
  expect(passwordElement).toBeInTheDocument();
  const passwordBox = screen.getByTestId('inputPassword');
  expect(passwordBox).toBeInTheDocument();
  const buttonElement = screen.getByText("Back");
  expect(buttonElement).toBeInTheDocument();
});

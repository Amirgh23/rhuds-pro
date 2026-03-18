import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CyberLoginForm } from './CyberLoginForm';

describe('CyberLoginForm', () => {
  it('renders the form', () => {
    render(<CyberLoginForm />);
    expect(screen.getByPlaceholderText('User')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders with custom placeholders', () => {
    render(<CyberLoginForm usernamePlaceholder="نام کاربری" passwordPlaceholder="رمز عبور" />);
    expect(screen.getByPlaceholderText('نام کاربری')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('رمز عبور')).toBeInTheDocument();
  });

  it('renders with custom button text', () => {
    render(<CyberLoginForm buttonText="ورود" />);
    expect(screen.getByText('ورود')).toBeInTheDocument();
  });

  it('calls onSubmit with form data', () => {
    const handleSubmit = jest.fn();
    render(<CyberLoginForm onSubmit={handleSubmit} />);

    const usernameInput = screen.getByPlaceholderText('User') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submitButton = screen.getByText('Log in');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass',
    });
  });

  it('renders with custom colors', () => {
    const { container } = render(
      <CyberLoginForm primaryColor="#FF0000" secondaryColor="#00FF00" accentColor="#0000FF" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('requires both username and password', () => {
    render(<CyberLoginForm />);
    const usernameInput = screen.getByPlaceholderText('User') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    expect(usernameInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });
});

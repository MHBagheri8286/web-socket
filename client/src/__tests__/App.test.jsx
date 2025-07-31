import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  test('starts with registration page', () => {
    render(<App />);
    expect(screen.getByText('Welcome to ChatApp')).toBeInTheDocument();
  });

  test('goes to chat after registration', async () => {
    render(<App />);

    // Fill username
    const input = screen.getByPlaceholderText('Enter a unique username...');
    fireEvent.change(input, { target: { value: 'testuser' } });

    // Submit
    fireEvent.click(screen.getByText('Join Chat Room'));

    // Should show chat
    expect(await screen.findByText("Let's Chat!")).toBeInTheDocument();
  });
});
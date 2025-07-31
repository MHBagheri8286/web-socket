import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registration from '../src/components/registration';

const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Registration', () => {
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    mockOnRegister.mockClear();
  });

  test('shows welcome message', () => {
    render(
      <TestWrapper>
        <Registration onRegister={mockOnRegister} />
      </TestWrapper>
    );

    expect(screen.getByText('Welcome to ChatApp')).toBeInTheDocument();
  });

  test('shows error when username is empty', async () => {
    render(
      <TestWrapper>
        <Registration onRegister={mockOnRegister} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Join Chat Room'));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
  });

  test('shows error when username is too short', async () => {
    render(
      <TestWrapper>
        <Registration onRegister={mockOnRegister} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter a unique username...');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.click(screen.getByText('Join Chat Room'));

    expect(
      await screen.findByText('Username must be at least 2 characters')
    ).toBeInTheDocument();
  });

  test('calls onRegister with valid username', async () => {
    render(
      <TestWrapper>
        <Registration onRegister={mockOnRegister} />
      </TestWrapper>
    );

    const input = screen.getByPlaceholderText('Enter a unique username...');
    fireEvent.change(input, { target: { value: 'john123' } });
    fireEvent.click(screen.getByText('Join Chat Room'));

    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalledWith({
        name: 'john123',
        status: 'online',
      });
    });
  });
});

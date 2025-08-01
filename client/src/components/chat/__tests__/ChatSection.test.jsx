import { render, screen } from '@testing-library/react';
import Chat from '../index';

// Mock the useChat hook
jest.mock('../useChat', () => ({
  useChat: jest.fn()
}));

import { useChat } from '../useChat';

describe('Chat', () => {
  const mockUser = { name: 'testUser', status: 'online' };

  beforeEach(() => {
    useChat.mockReturnValue({
      chats: [],
      users: [],
      typingUsers: [],
      onSubmit: jest.fn(),
      handleClearChat: jest.fn(),
      handleTyping: jest.fn(),
    });
  });

  test('shows chat title', () => {
    render(<Chat user={mockUser} />);
    expect(screen.getByText("Let's Chat!")).toBeInTheDocument();
  });

  test('shows empty message when no chats', () => {
    render(<Chat user={mockUser} />);
    expect(screen.getByText('No messages yet. Start the conversation!')).toBeInTheDocument();
  });

  test('shows messages when available', () => {
    useChat.mockReturnValue({
      chats: [
        { user: { name: 'John' }, message: 'Hello!' }
      ],
      users: [],
      typingUsers: [],
      onSubmit: jest.fn(),
      handleClearChat: jest.fn(),
      handleTyping: jest.fn(),
    });

    render(<Chat user={mockUser} />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  test('shows online users count', () => {
    useChat.mockReturnValue({
      chats: [],
      users: [
        { name: 'Alice', status: 'online' },
        { name: 'Bob', status: 'online' }
      ],
      typingUsers: [],
      onSubmit: jest.fn(),
      handleClearChat: jest.fn(),
      handleTyping: jest.fn(),
    });

    render(<Chat user={mockUser} />);
    expect(screen.getByText('Online Users (2)')).toBeInTheDocument();
  });

  test('shows typing indicator', () => {
    useChat.mockReturnValue({
      chats: [],
      users: [],
      typingUsers: [{ name: 'Alice' }],
      onSubmit: jest.fn(),
      handleClearChat: jest.fn(),
      handleTyping: jest.fn(),
    });

    render(<Chat user={mockUser} />);
    expect(screen.getByText('Alice is typing')).toBeInTheDocument();
  });
});
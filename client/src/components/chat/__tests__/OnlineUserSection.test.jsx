import { render, screen } from '@testing-library/react';
import OnlineUserSection from '../OnlineUsersSection';

describe('OnlineUsersSection', () => {
  test('shows no users message when empty', () => {
    render(<OnlineUserSection users={[]} />);
    
    expect(screen.getByText('Online Users (0)')).toBeInTheDocument();
    expect(screen.getByText('No users online')).toBeInTheDocument();
  });

  test('shows user count correctly', () => {
    const users = [
      { name: 'Alice', status: 'online' },
      { name: 'Bob', status: 'online' }
    ];

    render(<OnlineUserSection users={users} />);
    expect(screen.getByText('Online Users (2)')).toBeInTheDocument();
  });

  test('displays user names', () => {
    const users = [
      { name: 'Alice', status: 'online' },
      { name: 'Bob', status: 'offline' }
    ];

    render(<OnlineUserSection users={users} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('shows online badge for online users only', () => {
    const users = [
      { name: 'Alice', status: 'online' },
      { name: 'Bob', status: 'offline' }
    ];

    render(<OnlineUserSection users={users} />);
    
    const aliceItem = screen.getByText('Alice').closest('.user-item');
    const bobItem = screen.getByText('Bob').closest('.user-item');

    expect(aliceItem.querySelector('.badge.bg-success')).toBeInTheDocument();
    expect(bobItem.querySelector('.badge.bg-success')).not.toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar Component', () => {
  const mockPlaySound = jest.fn();

  beforeEach(() => {
    useOperations.mockReturnValue({
      playSound: mockPlaySound,
    });
  });

  it('renders sidebar navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('AI Operations Assistant')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('plays sound on click', () => {
    render(<Sidebar />);
    const link = screen.getByText('Dashboard');
    fireEvent.click(link);
    expect(mockPlaySound).toHaveBeenCalledWith('click');
  });
});

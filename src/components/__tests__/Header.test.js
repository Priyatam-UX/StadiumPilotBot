import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

describe('Header Component', () => {
  const mockPlaySound = jest.fn();
  const mockSetMobileSidebarOpen = jest.fn();
  const mockSetCurrentRole = jest.fn();

  beforeEach(() => {
    useOperations.mockReturnValue({
      weather: { condition: 'Clear skies', temperature: '31°C' },
      playSound: mockPlaySound,
      mobileSidebarOpen: false,
      setMobileSidebarOpen: mockSetMobileSidebarOpen,
      currentRole: 'Venue Organizer',
      setCurrentRole: mockSetCurrentRole,
    });
  });

  it('renders the brand title', () => {
    render(<Header />);
    expect(screen.getByText('StadiumPilot AI')).toBeInTheDocument();
  });

  it('toggles mobile sidebar state when clicked', () => {
    render(<Header />);
    const toggleBtn = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(toggleBtn);
    expect(mockSetMobileSidebarOpen).toHaveBeenCalled();
  });
});

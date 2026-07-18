import React from 'react';
import { render, screen } from '@testing-library/react';
import AppShell from '../AppShell';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('AppShell Component', () => {
  const mockPlaySound = jest.fn();

  beforeEach(() => {
    useOperations.mockReturnValue({
      mobileSidebarOpen: false,
      setMobileSidebarOpen: jest.fn(),
      playSound: mockPlaySound,
      currentRole: 'Venue Organizer',
      weather: { condition: 'Clear skies', temperature: '31°C' },
    });
  });

  it('renders children within layout grid structure', () => {
    render(
      <AppShell>
        <div data-testid="child">Shell Child Content</div>
      </AppShell>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });
});

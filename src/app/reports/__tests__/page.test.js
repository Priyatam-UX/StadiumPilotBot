import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportsPage from '../page';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/reports',
}));

describe('Reports Page', () => {
  beforeEach(() => {
    useOperations.mockReturnValue({
      visitorsCount: 48120,
      crowdDensity: 75,
      activeVolunteers: { deployed: 132 },
      medicalAlertsCount: 3,
      securityAlertsCount: 5,
      transportCapacity: 90,
      stadiumZones: [],
      incidents: [],
      weather: { condition: 'Clear skies', temperature: '31°C' },
      aiRecommendation: null,
      playSound: jest.fn(),
      currentRole: 'Venue Organizer',
      mobileSidebarOpen: false,
      setMobileSidebarOpen: jest.fn(),
    });
  });

  it('renders reports page header', () => {
    render(<ReportsPage />);
    expect(screen.getByText('AI Operations Report Studio')).toBeInTheDocument();
  });
});

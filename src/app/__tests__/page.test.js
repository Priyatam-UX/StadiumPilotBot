import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../page';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('@/components/CrowdChart', () => {
  return function MockedCrowdChart() {
    return <div data-testid="mocked-chart">Mocked Chart</div>;
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    useOperations.mockReturnValue({
      visitorsCount: 48120,
      crowdDensity: 78,
      activeVolunteers: { onDuty: 148, deployed: 132, standby: 16 },
      medicalAlertsCount: 3,
      securityAlertsCount: 5,
      transportCapacity: 92,
      incidents: [],
      weather: { condition: 'Clear skies', temperature: '31°C' },
      aiRecommendation: null,
      loadingInsights: false,
      generateAIRecommendations: jest.fn(),
      playSound: jest.fn(),
      compactMode: false,
      enableAIRecommendations: true,
      weatherWidget: true,
      crowdPrediction: true,
      transportStatusActive: true,
      currentRole: 'Venue Organizer',
      mobileSidebarOpen: false,
      setMobileSidebarOpen: jest.fn(),
      stadiumZones: [],
    });
  });

  it('renders dashboard panel overview', () => {
    render(<Dashboard />);
    expect(screen.getByText('Total Visitors')).toBeInTheDocument();
    expect(screen.getByText('Crowd Density')).toBeInTheDocument();
  });
});

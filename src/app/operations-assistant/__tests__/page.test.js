import React from 'react';
import { render, screen } from '@testing-library/react';
import AssistantPage from '../page';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/operations-assistant',
}));

describe('Assistant Page', () => {
  beforeEach(() => {
    useOperations.mockReturnValue({
      messages: [{ id: 1, sender: 'ai', text: 'Hello, how can I help?', timestamp: '12:00' }],
      loadingChat: false,
      sendMessageToAssistant: jest.fn(),
      clearChat: jest.fn(),
      crowdDensity: 75,
      activeVolunteers: { deployed: 132 },
      medicalAlertsCount: 3,
      securityAlertsCount: 5,
      stadiumZones: [],
      playSound: jest.fn(),
      currentRole: 'Venue Organizer',
      mobileSidebarOpen: false,
      setMobileSidebarOpen: jest.fn(),
      weather: { condition: 'Clear skies', temperature: '31°C' },
    });
  });

  it('renders operations assistant page header', () => {
    render(<AssistantPage />);
    expect(screen.getByText('Stadium Command Assistant')).toBeInTheDocument();
  });
});

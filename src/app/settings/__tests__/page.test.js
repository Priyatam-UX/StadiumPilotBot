import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../page';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/settings',
}));

describe('Settings Page', () => {
  beforeEach(() => {
    useOperations.mockReturnValue({
      compactMode: false,
      animations: true,
      soundEffects: true,
      enableAIRecommendations: true,
      enableAIAssistant: true,
      enableDemoMode: true,
      autoAIRefresh: true,
      refreshInterval: 30,
      liveDataActive: true,
      crowdHeatmap: true,
      zoneHighlight: true,
      weatherWidget: true,
      crowdPrediction: true,
      transportStatusActive: true,
      sustainabilityActive: true,
      alerts: { crowd: true, medical: true, security: true, transport: true, weather: true, emergency: true },
      responseSpeed: 'Balanced',
      clearChat: jest.fn(),
      playSound: jest.fn(),
      setCompactMode: jest.fn(),
      setAnimations: jest.fn(),
      setSoundEffects: jest.fn(),
      setEnableAIRecommendations: jest.fn(),
      setEnableAIAssistant: jest.fn(),
      setEnableDemoMode: jest.fn(),
      setAutoAIRefresh: jest.fn(),
      setRefreshInterval: jest.fn(),
      setLiveDataActive: jest.fn(),
      setCrowdHeatmap: jest.fn(),
      setZoneHighlight: jest.fn(),
      setWeatherWidget: jest.fn(),
      setCrowdPrediction: jest.fn(),
      setTransportStatusActive: jest.fn(),
      setSustainabilityActive: jest.fn(),
      setAlerts: jest.fn(),
      setResponseSpeed: jest.fn(),
      currentRole: 'Venue Organizer',
      mobileSidebarOpen: false,
      setMobileSidebarOpen: jest.fn(),
      weather: { condition: 'Clear skies', temperature: '31°C' },
    });
  });

  it('renders settings layout', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Operations Control Center')).toBeInTheDocument();
  });
});

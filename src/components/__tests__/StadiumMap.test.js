import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StadiumMap from '../StadiumMap';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

describe('StadiumMap Component', () => {
  const mockPlaySound = jest.fn();
  const mockStadiumZones = [
    { name: "Gate A", crowdPercent: 32, status: "green", x: 5, y: 34, width: 20, height: 13, note: "Primary ingress lane" },
    { name: "Gate B", crowdPercent: 74, status: "yellow", x: 5, y: 53, width: 20, height: 13, note: "Queue pressure building" },
    { name: "Main Pitch", crowdPercent: 11, status: "green", x: 31, y: 28, width: 38, height: 30, note: "Clear field of play" },
  ];

  beforeEach(() => {
    useOperations.mockReturnValue({
      stadiumZones: mockStadiumZones,
      playSound: mockPlaySound,
      crowdHeatmap: true,
      zoneHighlight: true,
    });
  });

  it('renders stadium zone list and details', () => {
    render(<StadiumMap />);
    expect(screen.getByText('Active Zone Status')).toBeInTheDocument();
    expect(screen.getByText('Gate A')).toBeInTheDocument();
    expect(screen.getByText('Gate B')).toBeInTheDocument();
  });

  it('plays sound and selects zone when clicked', () => {
    render(<StadiumMap />);
    const zoneButton = screen.getAllByRole('button', { name: /Inspect Gate A/i })[0];
    fireEvent.click(zoneButton);
    expect(mockPlaySound).toHaveBeenCalledWith('click');
  });
});

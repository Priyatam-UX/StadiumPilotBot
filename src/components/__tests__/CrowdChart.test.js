import React from 'react';
import { render } from '@testing-library/react';
import CrowdChart from '../CrowdChart';
import { useOperations } from '@/context/OperationsContext';

jest.mock('@/context/OperationsContext', () => ({
  useOperations: jest.fn(),
}));

// Mock recharts ResponsiveContainer to avoid JSDOM height/width 0 rendering bugs
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

describe('CrowdChart Component', () => {
  beforeEach(() => {
    useOperations.mockReturnValue({
      trends: [
        { time: '14:00', crowdIndex: 64, throughput: 72 },
        { time: '14:10', crowdIndex: 68, throughput: 69 },
      ],
    });
  });

  it('renders ResponsiveContainer wrapper', () => {
    const { container } = render(<CrowdChart />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

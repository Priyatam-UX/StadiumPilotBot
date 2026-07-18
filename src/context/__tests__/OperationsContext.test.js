import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { OperationsProvider, useOperations } from '../OperationsContext';

function ConsumerComponent() {
  const { currentRole, visitorsCount } = useOperations();
  return (
    <div>
      <span data-testid="role">{currentRole}</span>
      <span data-testid="visitors">{visitorsCount}</span>
    </div>
  );
}

describe('OperationsContext Provider', () => {
  it('provides operational state to descendants', async () => {
    await act(async () => {
      render(
        <OperationsProvider>
          <ConsumerComponent />
        </OperationsProvider>
      );
    });
    expect(screen.getByTestId('role')).toHaveTextContent('Venue Organizer');
    expect(screen.getByTestId('visitors')).toHaveTextContent('48120');
  });
});

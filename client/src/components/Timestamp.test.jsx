import React from 'react';
import { render, screen } from '@testing-library/react';
import Timestamp from './Timestamp';

describe('TextSearch', () => {
  it('renders without crashing', () => {
    expect(() => render(<Timestamp time={new Date()} />)).not.toThrow();
  });

  it('shows the time', async () => {
    const time = new Date(1756810800000);

    render(<Timestamp time={time} />);

    const stamp = await screen.findByText(/Data updated/);

    expect(stamp).toHaveTextContent('Data updated: 2 September 2025');
  });

  it('fails silently if no time given', async () => {
    render(<Timestamp />);

    const stamp = await screen.queryByText(/Data updated/);

    expect(stamp).toBeFalsy();
  });
});

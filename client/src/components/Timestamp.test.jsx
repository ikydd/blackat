import React from 'react';
import { render, screen } from '@testing-library/react';
import Timestamp from './Timestamp';

describe('TextSearch', () => {
  it('renders without crashing', () => {
    expect(() => render(<Timestamp />)).not.toThrow();
  });

  it('shows the time', () => {
    const time = 1756838018676;
    render(<Timestamp time={time} />);

    const stamp = screen.getByText(/Data updated/);

    expect(stamp).toHaveTextContent('Data updated: 9/2/2025');
  });
});

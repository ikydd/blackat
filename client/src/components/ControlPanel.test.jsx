import React from 'react';
import { render, screen } from '@testing-library/react';
import ControlPanel from './ControlPanel';

describe('ControlPanel', () => {
  it('renders without crashing', () => {
    expect(() => render(<ControlPanel />)).not.toThrow();
  });

  it('has a header', () => {
    render(<ControlPanel />);

    expect(screen.getByRole('heading')).toBeTruthy();
  });

  it('renders child elements', () => {
    render(
      <ControlPanel>
        <span title="test" />
      </ControlPanel>
    );

    expect(screen.getByTitle('test')).toBeTruthy();
  });
});

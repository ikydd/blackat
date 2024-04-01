import React from 'react';
import { render } from '@testing-library/react';
import ControlPanel from './ControlPanel';

describe('ControlPanel', () => {
  it('renders without crashing', () => {
    expect(() => render(<ControlPanel />)).not.toThrow();
  });

  it('has a header', () => {
    const { getByRole } = render(<ControlPanel />);

    expect(getByRole('heading')).toBeTruthy();
  });

  it('renders child elements', () => {
    const { getByTitle } = render(
      <ControlPanel>
        <span title="test" />
      </ControlPanel>
    );

    expect(getByTitle('test')).toBeTruthy();
  });
});

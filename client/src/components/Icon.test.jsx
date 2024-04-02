import React from 'react';
import { render } from '@testing-library/react';
import Icon from './Icon';

describe('Icon', () => {
  it('renders valid icons', () => {
    const { container } = render(<Icon code="jinteki" />);
    expect(container.firstChild).toBeTruthy();
  });
  it('does not render invalid icons', () => {
    const { container } = render(<Icon code="fake" />);
    expect(container.firstChild).toBeFalsy();
  });
});

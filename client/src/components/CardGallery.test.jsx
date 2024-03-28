import React from 'react';
import { render } from '@testing-library/react';
import CardGallery from './CardGallery';

describe('CardGallery', () => {
  it('renders', async () => {
    render(<CardGallery sections={[]} />);
    expect(true).toBeTruthy();
  });
});

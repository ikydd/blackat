import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Initial page', () => {
  it('loads the cards by default', async () => {
    const { findAllByRole } = render(<App />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(3);
  });
});

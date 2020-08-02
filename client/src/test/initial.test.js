import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Initial page', () => {
  it('starts with no cards to begin with', async () => {
    const { queryByRole } = render(<App />);

    expect(queryByRole('img')).toBeFalsy();
  })

  it('loads the cards', async () => {
    const { findAllByRole } = render(<App />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(3);
  });
});

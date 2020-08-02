import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('./helpers/api');

it('renders without crashing', () => {
  render(<App />);
});

it('starts with no cards to begin with', async () => {
  const { queryByRole } = render(<App />);

  expect(queryByRole('img')).toBeFalsy();
})

it('loads the runner cards by default', async () => {
  const { findAllByRole } = render(<App />);
  const cards = await findAllByRole('img');

  expect(cards).toHaveLength(3);
});

it('loads the corp cards with a prop', async () => {
  const { findAllByRole } = render(<App side="corp" />);
  const cards = await findAllByRole('img');

  expect(cards).toHaveLength(4);
});

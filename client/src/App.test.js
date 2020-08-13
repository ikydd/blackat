import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('./helpers/api');

afterEach(() => {
  localStorage.clear();
});

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

describe('saving state', () => {
  it('set state into localStorage', async () => {
    const { findAllByRole, getByText } = render(<App storage={true} />);
    fireEvent.click(getByText('Corp'))
    await findAllByRole('img');

    expect(JSON.parse(localStorage.getItem('settings'))).toEqual(expect.objectContaining({
      side: 'corp'
    }));
  });

  it('accepts variables from localStorage', async () => {
    localStorage.setItem('settings', JSON.stringify({
      side: 'corp'
    }));
    const { findAllByRole } = render(<App storage={true} />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(4);
  });

  it('clears state when you click the reset button', async () => {
    localStorage.setItem('settings', JSON.stringify({
      side: 'corp',
      factions: [{ code: 'agenda', side: 'corp' }, { code: 'ice', side: 'corp' }]
    }));
    const { getByText } = render(<App storage={true} />);
    fireEvent.click(getByText('Reset Filters'));

    expect(JSON.parse(localStorage.getItem('settings'))).toEqual(expect.objectContaining({
      side: 'runner',
      factions: []
    }));
  });
});

import React from 'react';
import { render, fireEvent, within, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './helpers/api';
import types from '../../fixtures/api/types.json';

jest.mock('./helpers/api');

afterEach(() => {
  api.reset();
  localStorage.clear();
});

it('renders without crashing', async () => {
  await waitFor(() => {
    expect(() => render(<App />)).not.toThrow();
  });
});

it('starts with no cards to begin with', async () => {
  const { queryByRole } = render(<App />);

  await waitFor(() => {
    expect(queryByRole('img')).toBeFalsy();
  });
});

it('loads the runner cards by default', async () => {
  const { findAllByRole } = render(<App />);
  const cards = await findAllByRole('img');

  expect(cards).toHaveLength(4);
});

it('loads the corp cards with a prop', async () => {
  const { findAllByRole } = render(<App side="corp" />);
  const cards = await findAllByRole('img');

  expect(cards).toHaveLength(4);
});

describe('saving state', () => {
  it('set state into localStorage', async () => {
    const { findAllByRole, findByText } = render(<App saveState={true} />);
    const corp = await findByText('Corp');
    fireEvent.click(corp);
    await findAllByRole('img');

    expect(JSON.parse(localStorage.getItem('settings'))).toEqual(
      expect.objectContaining({
        side: 'corp'
      })
    );
  });

  it('accepts variables from localStorage', async () => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        side: 'corp',
        factions: ['haas-bioroid']
      })
    );
    const { findAllByRole } = render(<App saveState={true} />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(1);
  });

  it('rejects malformed JSON', async () => {
    localStorage.setItem('settings', '}does not parse[');

    const { getByTestId, findByText } = render(<App saveState={true} />);
    const typesButton = await findByText(/Types/);
    fireEvent.click(typesButton);
    const filterBlock = getByTestId('types-filters');
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    const runnerTypes = types.filter(({ side }) => side === 'runner' || side === null).length;

    expect(checkboxes).toHaveLength(runnerTypes);
  });

  it('rejects old JSON', async () => {
    localStorage.setItem('settings', '{ "foo": "bar" }');

    const { findAllByRole, findByText } = render(<App saveState={true} />);
    const corp = await findByText('Corp');
    fireEvent.click(corp);
    await findAllByRole('img');

    const storage = JSON.parse(localStorage.getItem('settings'));

    expect(storage.foo).toBeUndefined();
  });

  it('clears state when you click the reset button', async () => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        side: 'corp',
        types: ['agenda', 'ice']
      })
    );

    const { findByText } = render(<App saveState={true} />);
    const reset = await findByText('Reset Filters');
    fireEvent.click(reset);

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('settings'))).toEqual(
        expect.objectContaining({
          side: 'runner',
          types: []
        })
      );
    });
  });
});

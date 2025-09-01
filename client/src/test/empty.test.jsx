import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { filterBy } from './helpers/operations';
import App from '../App';

jest.mock('../helpers/api');

describe('Empty behaviour', () => {
  it('shows the empty message', async () => {
    render(<App />);

    const some = await screen.findAllByRole('img');
    await waitFor(() => {
      expect(some).toHaveLength(4);
    });

    await filterBy('Types', 'Resource');

    const none = await screen.queryAllByRole('img');
    await waitFor(() => {
      expect(none).toHaveLength(0);
    });

    const empty = screen.getByText(/meow/);

    await waitFor(() => {
      expect(empty).toBeTruthy();
    });
  });
});

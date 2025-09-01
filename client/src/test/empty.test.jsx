import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { filterBy } from './helpers/operations';
import App from '../App';

jest.mock('../helpers/api');

describe('Empty behaviour', () => {
  it('shows the empty message', async () => {
    const { findAllByRole, getByText } = render(<App />);

    const some = await findAllByRole('img');
    await waitFor(() => {
      expect(some).toHaveLength(4);
    });

    await filterBy('Types', 'Resource');

    const none = await findAllByRole('img');
    await waitFor(() => {
      expect(none).toHaveLength(0);
    });

    const empty = getByText(/meow/);

    await waitFor(() => {
      expect(empty).toBeTruthy();
    });
  });
});

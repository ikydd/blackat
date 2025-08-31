import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Empty behaviour', () => {
  it('shows the empty message', async () => {
    const { queryAllByRole, getByText, findByTestId } = render(<App />);
    const filterBlock = await findByTestId('types-filters');
    fireEvent.click(getByText(/Types/));

    const asset = await within(filterBlock).findByLabelText('Resource');
    fireEvent.click(asset);

    const all = await queryAllByRole('img');

    expect(all).toHaveLength(0);

    const empty = getByText(/meow/);

    await waitFor(() => {
      expect(empty).toBeTruthy();
    });
  });
});

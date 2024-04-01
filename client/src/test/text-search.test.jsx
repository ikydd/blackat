import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Text Search', () => {
  it(`has a text search as the second textbox`, async () => {
    const { findAllByRole } = render(<App />);
    const textboxes = await findAllByRole('textbox');

    await waitFor(() => {
      expect(textboxes[1]).toHaveAttribute('placeholder', 'search text');
    });
  });

  it('only shows relevant cards given a text search', async () => {
    const search = 'strength for the remainder';
    const { findByPlaceholderText, findByRole } = render(<App />);
    const input = await findByPlaceholderText(`search text`);
    fireEvent.input(input, { target: { value: search } });
    const card = await findByRole('img');

    expect(card).toHaveAttribute('alt', 'Gordian Blade');
  });

  it('sets the default value given a text search', async () => {
    const search = 'remainder';
    const { findByPlaceholderText } = render(<App />);
    const input = await findByPlaceholderText(`search text`);
    fireEvent.input(input, { target: { value: search } });

    await waitFor(() => {
      expect(input).toHaveAttribute('value', 'remainder');
    });
  });
});

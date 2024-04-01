import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Title Search', () => {
  it(`has a title search as the first textbox`, async () => {
    const { findAllByRole } = render(<App />);
    const textboxes = await findAllByRole('textbox');
    await waitFor(() => {
      expect(textboxes[0]).toHaveAttribute('placeholder', 'search title');
    });
  });

  it('only shows relevant cards given a title search', async () => {
    const search = 'Blade';
    const { findByPlaceholderText, findByRole } = render(<App />);
    const input = await findByPlaceholderText(`search title`);
    fireEvent.input(input, { target: { value: search } });
    const card = await findByRole('img');

    expect(card).toHaveAttribute('alt', 'Gordian Blade');
  });

  it('sets the default value given a title search', async () => {
    const search = 'Blade';
    const { findByPlaceholderText } = render(<App />);
    const input = await findByPlaceholderText(`search title`);
    fireEvent.input(input, { target: { value: search } });

    await waitFor(() => {
      expect(input).toHaveAttribute('value', 'Blade');
    });
  });
});

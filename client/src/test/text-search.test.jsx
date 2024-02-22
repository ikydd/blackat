import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Text Search', () => {
  it(`has a text search as the second textbox`, () => {
    const { getAllByRole } = render(<App />);
    const textboxes = getAllByRole('textbox');

    expect(textboxes[1]).toHaveAttribute('placeholder', 'search text');
  });

  it('only shows relevant cards given a text search', async () => {
      const search = 'remainder';
      const { getByPlaceholderText, findByRole } = render(<App />);
      const input = getByPlaceholderText(`search text`);
      fireEvent.input(input, { target: { value: search } });
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', "Gordian Blade");
  });

  it('sets the default value given a text search', async () => {
      const search = 'remainder';
      const { getByPlaceholderText } = render(<App />);
      const input = getByPlaceholderText(`search text`);
      fireEvent.input(input, { target: { value: search } });

      expect(input).toHaveAttribute('value', "remainder");
  });
});

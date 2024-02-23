import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Title Search', () => {
  it(`has a title search as the first textbox`, () => {
    const { getAllByRole } = render(<App />);
    const textboxes = getAllByRole('textbox');

    expect(textboxes[0]).toHaveAttribute('placeholder', 'search title');
  });

  it('only shows relevant cards given a title search', async () => {
    const search = 'Blade';
    const { getByPlaceholderText, findByRole } = render(<App />);
    const input = getByPlaceholderText(`search title`);
    fireEvent.input(input, { target: { value: search } });
    const card = await findByRole('img');

    expect(card).toHaveAttribute('alt', "Gordian Blade");
  });

  it('sets the default value given a title search', async () => {
      const search = 'Blade';
      const { getByPlaceholderText } = render(<App />);
      const input = getByPlaceholderText(`search title`);
      fireEvent.input(input, { target: { value: search } });

      expect(input).toHaveAttribute('value', "Blade");
  });
});


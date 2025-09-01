import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe.each([
  {
    title: 'Title Search',
    placeholder: 'search title',
    position: 0,
    searchTerm: 'Blade'
  },
  {
    title: 'Text Search',
    placeholder: 'search text',
    position: 1,
    searchTerm: 'strength for the remainder'
  }
])('$title', ({ placeholder, searchTerm, position }) => {
  it(`has a text search as the second textbox`, async () => {
    render(<App />);
    const textboxes = await screen.findAllByRole('textbox');

    await waitFor(() => {
      expect(textboxes[position]).toHaveAttribute('placeholder', placeholder);
    });
  });

  it('only shows relevant cards given a text search', async () => {
    render(<App />);
    const input = await screen.findByPlaceholderText(placeholder);
    fireEvent.input(input, { target: { value: searchTerm } });
    const card = await screen.findByRole('img');

    expect(card).toHaveAttribute('alt', 'Gordian Blade');
  });

  it('sets the default value given a text search', async () => {
    render(<App />);
    const input = await screen.findByPlaceholderText(placeholder);
    fireEvent.input(input, { target: { value: searchTerm } });

    await waitFor(() => {
      expect(input).toHaveAttribute('value', searchTerm);
    });
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Sort', () => {
  it('sorts by faction by default', async () => {
    const { findAllByRole, getByRole } = render(<App />);

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['D4v1d', 'Gordian Blade', 'R&D Interface']);
    expect(getByRole('combobox')).toHaveValue('faction');
  })

  it('sorts by faction', async () => {
    const { findAllByRole, getByRole } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'faction' }});

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['D4v1d', 'Gordian Blade', 'R&D Interface']);
  })

  it('sorts by name', async () => {
    const { findAllByRole, getByRole, getByText } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'name' }});
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Chum', 'Data Mine', 'Mandatory Upgrades', 'Neural Katana']);
  })
});

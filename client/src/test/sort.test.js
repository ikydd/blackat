import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Sort', () => {
  describe('Faction sort', () => {
    it('sorts by faction by default', async () => {
      const { findAllByRole, getByRole } = render(<App />);

      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['D4v1d', 'Gordian Blade', 'R&D Interface']);
      expect(getByRole('combobox')).toHaveValue('faction');
    })

    it('sorts by faction', async () => {
      const { findAllByRole, getByRole } = render(<App />);
      fireEvent.select(getByRole('combobox'), { currentTarge: { value: 'faction' }});

      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['D4v1d', 'Gordian Blade', 'R&D Interface']);
    })
  });
});

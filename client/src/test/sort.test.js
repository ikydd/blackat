import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('Sort', () => {
  afterEach(() => {
    api.reset();
  })

  it('sorts by faction by default', async () => {
    api.setData('cards', require('../../../fixtures/api/faction-sort/faction-runner'))
    const { findAllByRole, getByRole } = render(<App />);
    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['D4v1d', 'Gordian Blade']);
    expect(getByRole('combobox')).toHaveValue('faction');
  })

  it('sorts by faction', async () => {
    api.setData('cards', require('../../../fixtures/api/faction-sort/faction-runner'))
    const { findAllByRole, getByRole } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'faction' }});

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['D4v1d', 'Gordian Blade']);
  })

  it('sorts by type', async () => {
    api.setData('cards', require('../../../fixtures/api/type-sort/runner'))
    const { findAllByRole, getByRole } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'type' }});

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['R&D Interface', 'The Helpful AI']);
  })

  it('sorts by pack', async () => {
    api.setData('cards', require('../../../fixtures/api/pack-sort/runner'))
    const { findAllByRole, getByRole } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'pack' }});

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Gordian Blade', 'R&D Interface']);
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

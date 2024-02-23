import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('Sort', () => {
  afterEach(() => {
    api.reset();
  })

  it('has the correct options', async () => {
    const { findAllByRole } = render(<App />);
    const options = await findAllByRole('option');

    expect(options).toEqual([
      expect.objectContaining({
          textContent: 'Sort by Faction',
          value: 'faction'
      }),
      expect.objectContaining({
          textContent: 'Sort by Type',
          value: 'type'
      }),
      expect.objectContaining({
          textContent: 'Sort by Cost',
          value: 'cost'
      }),
      expect.objectContaining({
          textContent: 'Sort by Strength',
          value: 'strength'
      }),
      expect.objectContaining({
          textContent: 'Sort by Subroutines',
          value: 'subroutines'
      }),
      expect.objectContaining({
          textContent: 'Sort by Agenda Points',
          value: 'agenda'
      }),
      expect.objectContaining({
          textContent: 'Sort by Pack',
          value: 'pack'
      }),
      expect.objectContaining({
          textContent: 'Sort by Title',
          value: 'title'
      }),
      expect.objectContaining({
          textContent: 'Sort by Illustrator',
          value: 'illustrator'
      })
    ]);
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

    expect(cards).toEqual(['R&D Interface', 'All-nighter']);
  })

  it('sorts by pack', async () => {
    api.setData('cards', require('../../../fixtures/api/pack-sort/runner'))
    const { findAllByRole, getByRole } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'pack' }});

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Gordian Blade', 'R&D Interface']);
  })

  it('sorts by title', async () => {
    const { findAllByRole, getByRole, getByText } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'title' }});
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Chum', 'Data Mine', 'Mandatory Upgrades', 'Neural Katana']);
  })

  it('sorts by illustrator', async () => {
    api.setData('cards', require('../../../fixtures/api/illustrator-sort/corp'))
    const { findAllByRole, getByRole, getByText } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'illustrator' }});
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['SanSan City Grid', 'Mandatory Upgrades']);
  })

  it('sorts by cost', async () => {
    api.setData('cards', require('../../../fixtures/api/cost-sort/cost'))
    const { findAllByRole, getByRole } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'cost' }});

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  })

  it('sorts by agenda points', async () => {
    api.setData('cards', require('../../../fixtures/api/agenda-sort/agenda'))
    const { findAllByRole, getByRole, getByText } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'agenda' }});
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  })

  it('sorts by strength', async () => {
    api.setData('cards', require('../../../fixtures/api/strength-sort/strength'))
    const { findAllByRole, getByRole, getByText } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'strength' }});
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  })

  it('sorts by subroutines', async () => {
    api.setData('cards', require('../../../fixtures/api/subroutines-sort/subroutines'))
    const { findAllByRole, getByRole, getByText } = render(<App />);
    fireEvent.change(getByRole('combobox'), { target: { value: 'subroutines' }});
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  })
});

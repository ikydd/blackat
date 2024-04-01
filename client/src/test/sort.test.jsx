import React from 'react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

const loadFile = (path) => JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));

describe('Sort', () => {
  afterEach(() => {
    api.reset();
  });

  it('has the correct options', async () => {
    const { findAllByRole } = render(<App />);
    await findAllByRole('img');
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
  });

  it('sorts by faction by default', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-runner.json'));
    const { findAllByRole, findByRole } = render(<App />);
    const sort = await findByRole('combobox');
    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['D4v1d', 'Gordian Blade']);
    expect(sort).toHaveValue('faction');
  });

  it('sorts by faction', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-runner.json'));
    const { findAllByRole, findByRole } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'faction' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['D4v1d', 'Gordian Blade']);
  });

  it('sorts by type', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/type-sort/runner.json'));
    const { findAllByRole, findByRole } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'type' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['R&D Interface', 'All-nighter']);
  });

  it('sorts by pack', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/pack-sort/runner.json'));
    const { findAllByRole, findByRole } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'pack' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Gordian Blade', 'R&D Interface']);
  });

  it('sorts by title', async () => {
    const { findAllByRole, findByRole, getByText } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'title' } });
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Chum', 'Data Mine', 'Mandatory Upgrades', 'Neural Katana']);
  });

  it('sorts by illustrator', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/illustrator-sort/corp.json'));
    const { findAllByRole, findByRole, getByText } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, {
      target: { value: 'illustrator' }
    });
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['SanSan City Grid', 'Mandatory Upgrades']);
  });

  it('sorts by cost', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/cost-sort/cost.json'));
    const { findAllByRole, findByRole } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'cost' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('sorts by agenda points', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/agenda.json'));
    const { findAllByRole, findByRole, getByText } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'agenda' } });
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('sorts by strength', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/strength-sort/strength.json'));
    const { findAllByRole, findByRole, getByText } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'strength' } });
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('sorts by subroutines', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/subroutines-sort/subroutines.json'));
    const { findAllByRole, findByRole, getByText } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, {
      target: { value: 'subroutines' }
    });
    fireEvent.click(getByText('Corp'));

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('sorts asc correctly with undefined', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/cost-sort/undefined.json'));
    const { findAllByRole, findByRole } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'cost' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Alpha', 'Zeta', 'Infinity', 'Bar']);
  });

  it('sorts desc correctly with undefined', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/undefined.json'));
    const { findAllByRole, findByRole } = render(<App side="corp" />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'agenda' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Zoo', 'Bar', 'Null', 'Tail']);
  });

  it('sorts X to the end when asc', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/cost-sort/x.json'));
    const { findAllByRole, findByRole } = render(<App />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'cost' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Alpha', 'Zeta', 'Infinity', 'Bar', 'Foo', 'Null']);
  });

  it('sorts X to the end when desc', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/strength-sort/x.json'));
    const { findAllByRole, findByRole } = render(<App side="corp" />);
    const sort = await findByRole('combobox');
    fireEvent.change(sort, { target: { value: 'strength' } });

    const images = await findAllByRole('img');
    const cards = images.map(({ alt }) => alt);

    expect(cards).toEqual(['Ichi', 'Bar', 'Fire', 'Zed', 'Eli']);
  });
});

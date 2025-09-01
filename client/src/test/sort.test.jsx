import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';
import loadFile from './helpers/load-file';
import { sortBy } from './helpers/operations';
import { findImageTitles, findSectionHeadings } from './helpers/finders';

jest.mock('../helpers/api');

describe('Sort', () => {
  afterEach(() => {
    api.reset();
  });

  it('has the correct options', async () => {
    render(<App />);
    const options = await screen.findAllByRole('option');

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
    render(<App />);
    const sort = await screen.findByRole('combobox');

    const cards = await findImageTitles();

    expect(cards).toEqual(['D4v1d', 'Gordian Blade']);
    expect(sort).toHaveValue('faction');
  });

  it('sorts by faction', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-runner.json'));
    render(<App />);
    await sortBy('faction');

    const cards = await findImageTitles();

    expect(cards).toEqual(['D4v1d', 'Gordian Blade']);
  });

  it('has the right headers when sorting by faction', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-runner.json'));
    render(<App />);
    await sortBy('faction');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['Anarch', 'Shaper']);
  });

  it('sorts by type', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/type-sort/runner.json'));
    render(<App />);
    await sortBy('type');

    const cards = await findImageTitles();

    expect(cards).toEqual(['R&D Interface', 'All-nighter']);
  });

  it('has the right headers when sorting by types', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/type-sort/runner.json'));
    render(<App />);
    await sortBy('type');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['Hardware', 'Resource']);
  });

  it('sorts by pack', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/pack-sort/runner.json'));
    render(<App />);
    await sortBy('pack');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Gordian Blade', 'R&D Interface']);
  });

  it('has the right headers when sorting by pack', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/pack-sort/runner.json'));
    render(<App />);
    await sortBy('pack');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['Core Set', 'Future Proof']);
  });

  it('sorts by title', async () => {
    render(<App side="corp" />);
    await sortBy('title');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Chum', 'Data Mine', 'Mandatory Upgrades', 'Neural Katana']);
  });

  it('has no headers when sorting by title', async () => {
    render(<App side="corp" />);
    await sortBy('title');

    const sections = await findSectionHeadings();

    expect(sections).toHaveLength(0);
  });

  it('sorts by illustrator', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/illustrator-sort/corp.json'));
    render(<App side="corp" />);
    await sortBy('illustrator');

    const cards = await findImageTitles();

    expect(cards).toEqual(['SanSan City Grid', 'Mandatory Upgrades']);
  });

  it('has the right headers when sorting by illustrator', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/illustrator-sort/corp.json'));
    render(<App side="corp" />);
    await sortBy('illustrator');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['Ed Mattinian', 'Mauricio Herrera']);
  });

  it('sorts by cost', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/cost-sort/cost.json'));
    render(<App />);
    await sortBy('cost');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('has the right headers when sorting by cost', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/cost-sort/cost.json'));
    render(<App />);
    await sortBy('cost');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['1', '4']);
  });

  it('sorts by agenda points', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/agenda.json'));
    render(<App side="corp" />);
    await sortBy('agenda');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('has the right headers when sorting by agenda points', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/agenda.json'));
    render(<App side="corp" />);
    await sortBy('agenda');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['3 agenda points', '2 agenda points']);
  });

  it('sorts by strength', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/strength-sort/strength.json'));
    render(<App side="corp" />);
    await sortBy('strength');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('has the right headers when sorting by strength', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/strength-sort/strength.json'));
    render(<App side="corp" />);
    await sortBy('strength');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['2 strength', '1 strength']);
  });

  it('sorts by subroutines', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/subroutines-sort/subroutines.json'));
    render(<App side="corp" />);
    await sortBy('subroutines');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Foo', 'Bar']);
  });

  it('has the right headers when sorting by subroutines', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/subroutines-sort/subroutines.json'));
    render(<App side="corp" />);
    await sortBy('subroutines');

    const sections = await findSectionHeadings();

    expect(sections).toEqual(['4+', '3']);
  });

  it('sorts asc correctly with undefined', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/cost-sort/undefined.json'));
    render(<App />);
    await sortBy('cost');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Alpha', 'Zeta', 'Infinity', 'Bar']);
  });

  it('sorts desc correctly with undefined', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/undefined.json'));
    render(<App side="corp" />);
    await sortBy('agenda');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Zoo', 'Bar', 'Null', 'Tail']);
  });

  it('sorts X to the end when asc', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/cost-sort/x.json'));
    render(<App />);
    await sortBy('cost');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Alpha', 'Zeta', 'Infinity', 'Bar', 'Foo', 'Null']);
  });

  it('sorts X to the end when desc', async () => {
    api.setData('cards', loadFile('../../../fixtures/api/strength-sort/x.json'));
    render(<App side="corp" />);
    await sortBy('strength');

    const cards = await findImageTitles();

    expect(cards).toEqual(['Ichi', 'Bar', 'Fire', 'Zed', 'Eli']);
  });
});

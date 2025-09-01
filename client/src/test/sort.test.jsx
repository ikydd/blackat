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

  const sortMethods = [
    {
      code: 'faction',
      file: 'faction-sort/faction-runner.json',
      matches: ['D4v1d', 'Gordian Blade'],
      headers: ['Anarch', 'Shaper']
    },
    {
      code: 'type',
      file: 'type-sort/runner.json',
      matches: ['R&D Interface', 'All-nighter'],
      headers: ['Hardware', 'Resource']
    },
    {
      code: 'pack',
      file: 'pack-sort/runner.json',
      matches: ['Gordian Blade', 'R&D Interface'],
      headers: ['Core Set', 'Future Proof']
    },
    {
      code: 'title',
      side: 'corp',
      file: 'cards.json',
      matches: ['Chum', 'Data Mine', 'Mandatory Upgrades', 'Neural Katana'],
      headers: []
    },
    {
      code: 'illustrator',
      side: 'corp',
      file: 'illustrator-sort/corp.json',
      matches: ['SanSan City Grid', 'Mandatory Upgrades'],
      headers: ['Ed Mattinian', 'Mauricio Herrera']
    },
    {
      code: 'cost',
      file: 'cost-sort/cost.json',
      matches: ['Foo', 'Bar'],
      headers: ['1', '4']
    },
    {
      code: 'agenda',
      side: 'corp',
      file: 'agenda-sort/agenda.json',
      matches: ['Foo', 'Bar'],
      headers: ['3 agenda points', '2 agenda points']
    },
    {
      code: 'strength',
      side: 'corp',
      file: 'strength-sort/strength.json',
      matches: ['Foo', 'Bar'],
      headers: ['2 strength', '1 strength']
    },
    {
      code: 'subroutines',
      side: 'corp',
      file: 'subroutines-sort/subroutines.json',
      matches: ['Foo', 'Bar'],
      headers: ['4+', '3']
    }
  ];

  describe.each(sortMethods)(
    'sort by $code',
    ({ code, side = 'runner', file, matches, headers }) => {
      it('sorts correctly', async () => {
        api.setData('cards', loadFile(`../../../fixtures/api/${file}`));
        render(<App side={side} />);
        await sortBy(code);

        const cards = await findImageTitles();

        expect(cards).toEqual(matches);
      });

      it('has the right headers', async () => {
        api.setData('cards', loadFile(`../../../fixtures/api/${file}`));
        render(<App side={side} />);
        await sortBy(code);

        const sections = await findSectionHeadings();

        expect(sections).toEqual(headers);
      });
    }
  );

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

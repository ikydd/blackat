import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { clickFilter, setSide, clickOption, filterBy } from './helpers/operations';
import { findBlock, findCheckboxes, findImageTitles, findCheckbox } from './helpers/finders';
import factions from '../../../fixtures/api/factions.json';
import types from '../../../fixtures/api/types.json';
import subtypes from '../../../fixtures/api/subtypes.json';
import packs from '../../../fixtures/api/packs.json';

jest.mock('../helpers/api');

const info = [
  {
    title: 'Factions',
    code: 'factions',
    data: factions,
    option: 'Anarch',
    option2: 'Jinteki',
    cards: ['D4v1d'],
    unfilteredCorpCards: 4
  },
  {
    title: 'Types',
    code: 'types',
    data: types,
    option: 'Hardware',
    option2: 'Agenda',
    cards: ['R&D Interface'],
    unfilteredCorpCards: 4,
    sharedOption: 'Identity'
  },
  {
    title: 'Subtypes',
    code: 'subtypes',
    data: subtypes,
    option: 'Icebreaker',
    option2: 'Code Gate',
    cards: ['Gordian Blade'],
    unfilteredCorpCards: 4,
    sharedOption: 'Bioroid'
  },
  {
    title: 'Packs',
    code: 'packs',
    data: packs.flatMap((pack) => {
      if (pack.items.length > 1) {
        return [pack, ...pack.items];
      }
      return pack;
    }),
    option: 'What Lies Ahead',
    cards: ['D4v1d'],
    unfilteredCorpCards: 1,
    sharedOption: 'Double Time'
  }
];

describe.each(info)(
  '$title filter',
  ({ title, code, data, option, option2, cards, unfilteredCorpCards, sharedOption }) => {
    it('has the correct title', async () => {
      render(<App />);
      const filterBlock = await findBlock(code);
      const heading = within(filterBlock).getByText(title);

      await waitFor(() => {
        expect(heading).toBeTruthy();
      });
    });

    it('starts closed', async () => {
      render(<App />);
      const checkboxes = await findCheckboxes(code);

      await waitFor(() => {
        expect(checkboxes).toHaveLength(0);
      });
    });

    it('opens when clicked', async () => {
      render(<App />);
      await clickFilter(title);
      const checkboxes = await findCheckboxes(code);

      const runnerOptions = data.filter(({ side }) => !side || side === 'runner').length;

      expect(checkboxes).toHaveLength(runnerOptions);
    });

    it('closes when clicked again', async () => {
      render(<App />);
      await clickFilter(title);
      await clickFilter(title);
      const checkboxes = await findCheckboxes(code);

      expect(checkboxes).toHaveLength(0);
    });

    it('begins unchecked checkboxes for runner', async () => {
      render(<App />);
      await clickFilter(title);
      const checkboxes = await findCheckboxes(code);

      checkboxes.forEach((box) => {
        expect(box).not.toBeChecked();
      });
    });

    it('remains open when switching sides', async () => {
      render(<App />);
      await clickFilter(title);
      await setSide('Corp');

      const checkboxes = await findCheckboxes(code);

      const corpFactions = data.filter(({ side }) => !side || side === 'corp').length;

      expect(checkboxes).toHaveLength(corpFactions);
    });

    it('begins with empty checkboxes for corp', async () => {
      render(<App />);
      await clickFilter(title);
      await setSide('Corp');

      const checkboxes = await findCheckboxes(code);

      checkboxes.forEach((box) => {
        expect(box).not.toBeChecked();
      });
    });

    it('selects checkboxes when clicked', async () => {
      render(<App />);
      await clickFilter(title);

      const unchecked = await findCheckboxes(code);

      fireEvent.click(unchecked[0]);

      const checkboxes = await findCheckboxes(code);
      const checked = checkboxes.shift();

      expect(checked).toBeChecked();
      checkboxes.forEach((box) => {
        expect(box).not.toBeChecked();
      });
    });

    it('filters cards correctly', async () => {
      render(<App />);
      await clickFilter(title);
      const all = await findImageTitles('img');

      expect(all).toHaveLength(4);

      await clickOption(option);
      const filtered = await findImageTitles('img');

      expect(filtered).toEqual(cards);
    });

    it('retains filters when switching sides', async () => {
      if (option2) {
        render(<App />);
        await filterBy(title, option);
        await setSide('Corp');
        await clickOption(option2);
        await setSide('Runner');

        const checkbox = await findCheckbox(code, option);

        expect(checkbox).toBeChecked();
      }
    });

    it('does not apply filters to the other side', async () => {
      render(<App />);
      await filterBy(title, option);
      await setSide('Corp');

      const all = await findImageTitles('img');

      expect(all).toHaveLength(unfilteredCorpCards);
    });

    it('includes filters appropriate to both sides', async () => {
      if (sharedOption) {
        render(<App />);
        await filterBy(title, sharedOption);
        await setSide('Corp');

        const checkbox = await findCheckbox(code, sharedOption);

        expect(checkbox).toBeChecked();
      }
    });

    it('clears filters when clicked', async () => {
      render(<App />);
      await filterBy(title, option);

      const checkboxes = await findCheckboxes(code);

      const filter = await findBlock(code);
      const clear = await within(filter).findByRole('button', { name: 'Clear Filters' });
      fireEvent.click(clear);

      checkboxes.forEach((box) => {
        expect(box).not.toBeChecked();
      });
    });
  }
);

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { filterBy, openFilter, setSide, clickOption } from './helpers/operations';
import { findCheckboxes } from './helpers/finders';
import packs from '../../../fixtures/api/packs.json';

jest.mock('../helpers/api');

describe('Packs filters', () => {
  it('shows the same checkboxes when corp is selected', async () => {
    render(<App />);
    await openFilter('Packs');

    const runnerBoxes = await findCheckboxes('packs');

    await setSide('Corp');
    const corpBoxes = await findCheckboxes('packs');

    expect(corpBoxes).toEqual(runnerBoxes);
  });

  describe('Cycle Checkbox', () => {
    it('does not select the cycle when a subitem is checked', async () => {
      render(<App />);
      await filterBy('Packs', 'Trace Amount');

      const cycle = await screen.findByLabelText('Genesis');
      expect(cycle).not.toBeChecked();
    });

    it('selects all in a cycle when clicked regardless of their current state', async () => {
      render(<App />);
      await filterBy('Packs', 'Trace Amount');
      await clickOption('Genesis');

      const checkboxes = await findCheckboxes('packs');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((item) => item.getAttribute('value'));

      const expected = ['genesis'].concat(
        packs.find(({ code }) => code === 'genesis').items.map(({ code }) => code)
      );

      expect(selected).toEqual(expected);
    });

    it('deselects all in a cycle when deselected', async () => {
      render(<App />);

      await filterBy('Packs', 'Trace Amount');
      await clickOption('Genesis');
      await clickOption('Genesis');

      const checkboxes = await findCheckboxes('packs');

      const selected = checkboxes.filter(({ checked }) => checked);

      expect(selected).toHaveLength(0);
    });

    it('deselects cycle when not all subitems are checked', async () => {
      render(<App />);
      const [cycle] = await filterBy('Packs', 'Genesis');

      await clickOption('Trace Amount');

      expect(cycle).not.toBeChecked();
    });
  });
});

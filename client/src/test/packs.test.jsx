import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { filterBy, openFilter, setSide, clickOption } from './helpers/operations';
import { findImageTitles } from './helpers/finders';
import packs from '../../../fixtures/api/packs.json';

jest.mock('../helpers/api');

describe('Packs filters', () => {
  it('has the correct title', async () => {
    const { findByTestId } = render(<App />);
    const filterBlock = await findByTestId('packs-filters');
    const heading = within(filterBlock).getByText('Packs');

    await waitFor(() => {
      expect(heading).toBeTruthy();
    });
  });

  it('starts with no checkboxes', async () => {
    const { findByTestId } = render(<App />);
    const filterBlock = await findByTestId('packs-filters');
    const checkboxes = within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes).toHaveLength(0);
    });
  });

  it('shows some checkboxes', async () => {
    const { getByTestId } = render(<App />);

    await openFilter('Packs');
    const filterBlock = getByTestId('packs-filters');

    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('starts with empty checkboxes', async () => {
    const { getByTestId } = render(<App />);

    await openFilter('Packs');
    const filterBlock = getByTestId('packs-filters');

    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('shows the same checkboxes when corp is selected', async () => {
    const { getByTestId } = render(<App />);

    await openFilter('Packs');
    const filterBlock = getByTestId('packs-filters');

    const runnerBoxes = await within(filterBlock).findAllByRole('checkbox');

    await setSide('Corp');
    const corpBoxes = await within(filterBlock).findAllByRole('checkbox');

    expect(corpBoxes).toEqual(runnerBoxes);
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId } = render(<App />);

    await openFilter('Packs');
    const filterBlock = getByTestId('packs-filters');

    const unchecked = await within(filterBlock).findAllByRole('checkbox');

    fireEvent.click(unchecked[0]);

    const checkboxes = await within(filterBlock).findAllByRole('checkbox');
    const checked = checkboxes.shift();

    expect(checked).toBeChecked();
    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('filters cards correctly', async () => {
    const { findAllByRole } = render(<App />);
    const all = await findAllByRole('img');

    await waitFor(() => {
      expect(all).toHaveLength(4);
    });

    await filterBy('Packs', 'What Lies Ahead');
    const filtered = await findImageTitles();

    await waitFor(() => {
      expect(filtered).toEqual(['D4v1d']);
    });
  });

  it('retains filters for both sides', async () => {
    render(<App />);

    const [wla] = await filterBy('Packs', 'What Lies Ahead');
    await setSide('Corp');

    expect(wla).toBeChecked();
  });

  describe('Cycle Checkbox', () => {
    it('does not select the cycle when a subitem is checked', async () => {
      const { findByLabelText } = render(<App />);
      await filterBy('Packs', 'Trace Amount');

      const cycle = await findByLabelText('Genesis');
      expect(cycle).not.toBeChecked();
    });

    it('selects all in a cycle when clicked regardless of their current state', async () => {
      const { getByTestId } = render(<App />);
      await filterBy('Packs', 'Trace Amount');
      await clickOption('Genesis');

      const filterBlock = getByTestId('packs-filters');
      const checkboxes = await within(filterBlock).findAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((item) => item.getAttribute('value'));

      const expected = ['genesis'].concat(
        packs.find(({ code }) => code === 'genesis').items.map(({ code }) => code)
      );

      expect(selected).toEqual(expected);
    });

    it('deselects all in a cycle when deselected', async () => {
      const { getByTestId } = render(<App />);

      await filterBy('Packs', 'Trace Amount');
      await clickOption('Genesis');
      await clickOption('Genesis');
      const filterBlock = getByTestId('packs-filters');
      const checkboxes = await within(filterBlock).findAllByRole('checkbox');

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

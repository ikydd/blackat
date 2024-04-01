import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
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
    const { getByTestId, findByText } = render(<App />);
    const packsButton = await findByText('Packs');
    const filterBlock = getByTestId('packs-filters');
    fireEvent.click(packsButton);
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('starts with empty checkboxes', async () => {
    const { getByTestId, findByText } = render(<App />);
    const packsButton = await findByText('Packs');
    const filterBlock = getByTestId('packs-filters');
    fireEvent.click(packsButton);
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('shows the same checkboxes when corp is selected', async () => {
    const { getByTestId, findByText, getByText } = render(<App />);
    const packsButton = await findByText('Packs');
    const filterBlock = getByTestId('packs-filters');
    fireEvent.click(packsButton);

    const runnerBoxes = await within(filterBlock).findAllByRole('checkbox');

    fireEvent.click(getByText('Corp'));
    const corpBoxes = await within(filterBlock).findAllByRole('checkbox');

    expect(corpBoxes).toEqual(runnerBoxes);
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId, findByText } = render(<App />);
    const packsButton = await findByText('Packs');
    const filterBlock = getByTestId('packs-filters');
    fireEvent.click(packsButton);
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
    const { getByTestId, findAllByRole, findByRole, findByText } = render(<App />);
    const packsButton = await findByText('Packs');
    const filterBlock = getByTestId('packs-filters');
    fireEvent.click(packsButton);
    const unchecked = await within(filterBlock).findByLabelText('What Lies Ahead');
    const all = await findAllByRole('img');

    await waitFor(() => {
      expect(all).toHaveLength(4);
    });

    fireEvent.click(unchecked);
    const filtered = await findByRole('img');

    await waitFor(() => {
      expect(filtered).toHaveAttribute('alt', 'D4v1d');
    });
  });

  it('retains filters for both sides', async () => {
    const { getByTestId, getByText, findByText } = render(<App />);
    const packsButton = await findByText('Packs');
    const filterBlock = getByTestId('packs-filters');
    fireEvent.click(packsButton);

    let wla = await within(filterBlock).findByLabelText('What Lies Ahead');
    fireEvent.click(wla);
    fireEvent.click(getByText('Corp'));

    wla = await within(filterBlock).findByLabelText('What Lies Ahead');

    expect(wla).toBeChecked();
  });

  describe('Cycle Checkbox', () => {
    it('does not select the cycle when a subitem is checked', async () => {
      const { getByTestId, findByText, findByLabelText } = render(<App />);
      const packsButton = await findByText('Packs');
      const filterBlock = getByTestId('packs-filters');
      fireEvent.click(packsButton);

      const genesis = packs.find(({ code }) => code === 'genesis');

      const pack = await within(filterBlock).findByLabelText(genesis.items[3].name);
      fireEvent.click(pack);

      const cycle = await findByLabelText(genesis.name);
      expect(cycle).not.toBeChecked();
    });

    it('selects all in a cycle when clicked regardless of their current state', async () => {
      const { getByTestId, findByText, findByLabelText } = render(<App />);
      const packsButton = await findByText('Packs');
      const filterBlock = getByTestId('packs-filters');
      fireEvent.click(packsButton);

      const genesis = packs.find(({ code }) => code === 'genesis');

      const pack = await within(filterBlock).findByLabelText(genesis.items[3].name);
      fireEvent.click(pack);

      const cycle = await findByLabelText(genesis.name);
      fireEvent.click(cycle);

      const checkboxes = await within(filterBlock).findAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((item) => item.getAttribute('value'));

      const expected = ['genesis'].concat(genesis.items.map(({ code }) => code));

      expect(selected).toEqual(expected);
    });

    it('deselects all in a cycle when deselected', async () => {
      const { getByTestId, findByText, findByLabelText } = render(<App />);
      const packsButton = await findByText('Packs');
      const filterBlock = getByTestId('packs-filters');
      fireEvent.click(packsButton);

      const genesis = packs.find(({ code }) => code === 'genesis');

      const pack = await within(filterBlock).findByLabelText(genesis.items[3].name);
      fireEvent.click(pack);

      const cycle = await findByLabelText(genesis.name);
      fireEvent.click(cycle);
      fireEvent.click(cycle);

      const checkboxes = await within(filterBlock).findAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((item) => item.getAttribute('value'));

      expect(selected).toHaveLength(0);
    });

    it('deselects cycle when not all subitems are checked', async () => {
      const { getByTestId, findByText, findByLabelText } = render(<App />);
      const packsButton = await findByText('Packs');
      const filterBlock = getByTestId('packs-filters');
      fireEvent.click(packsButton);

      const genesis = packs.find(({ code }) => code === 'genesis');

      let cycle = await findByLabelText(genesis.name);
      fireEvent.click(cycle);

      const pack = await within(filterBlock).findByLabelText(genesis.items[3].name);
      fireEvent.click(pack);

      cycle = await findByLabelText(genesis.name);
      expect(cycle).not.toBeChecked();
    });
  });
});

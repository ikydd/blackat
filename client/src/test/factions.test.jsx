import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import factions from '../../../fixtures/api/factions.json';

jest.mock('../helpers/api');

describe('Faction filters', () => {
  it('has the correct title', async () => {
    const { getByTestId } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    const heading = within(filterBlock).getByText('Factions');

    await waitFor(() => {
      expect(heading).toBeTruthy();
    });
  });

  it('starts with no checkboxes', async () => {
    const { getByTestId } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    const checkboxes = within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes).toHaveLength(0);
    });
  });

  it('has some checkboxes for runner when clicked', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    const runnerFactions = factions.filter(({ side }) => side === 'runner').length;

    expect(checkboxes).toHaveLength(runnerFactions);
  });

  it('starts with empty checkboxes for runner', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('loads some checkboxes for corp', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));
    fireEvent.click(getByText('Corp'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    const corpFactions = factions.filter(({ side }) => side === 'corp').length;

    expect(checkboxes).toHaveLength(corpFactions);
  });

  it('starts with empty checkboxes for corp', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));
    fireEvent.click(getByText('Corp'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));
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
    const { getByTestId, findAllByRole, findByRole, getByText } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));
    const unchecked = await within(filterBlock).findByLabelText('Anarch');
    const all = await findAllByRole('img');

    expect(all).toHaveLength(4);

    fireEvent.click(unchecked);
    const filtered = await findByRole('img');

    expect(filtered).toHaveAttribute('alt', 'D4v1d');
  });

  it('retains filters from each side', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));

    let anarch = await within(filterBlock).findByLabelText('Anarch');
    fireEvent.click(anarch);
    fireEvent.click(getByText('Corp'));

    const jinteki = await within(filterBlock).findByLabelText('Jinteki');
    fireEvent.click(jinteki);
    fireEvent.click(getByText('Runner'));

    anarch = await within(filterBlock).findByLabelText('Anarch');

    expect(anarch).toBeChecked();
  });

  it('does not apply filters to the wrong side', async () => {
    const { getByTestId, getByText, findAllByRole } = render(<App />);
    const filterBlock = getByTestId('factions-filters');
    fireEvent.click(getByText('Factions'));

    const anarch = await within(filterBlock).findByLabelText('Anarch');
    fireEvent.click(anarch);
    fireEvent.click(getByText('Corp'));

    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(4);
  });
});

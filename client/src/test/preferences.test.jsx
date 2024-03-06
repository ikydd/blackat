import React from 'react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

const loadFile = (path) => JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));

jest.mock('../helpers/api');

describe('Preferences filters', () => {
  it('has the correct title', async () => {
    const { getByTestId } = render(<App />);
    const filterBlock = getByTestId('preferences-filters');
    const heading = await within(filterBlock).findByRole('heading');

    expect(heading).toHaveTextContent('Preferences');
  });

  it('starts with correct checkboxes', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('preferences-filters');
    fireEvent.click(getByText('Preferences'));
    const checkboxes = within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes).toHaveLength(1);
    });
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId, getByText, getByDisplayValue } = render(<App />);
    const filterBlock = getByTestId('preferences-filters');
    fireEvent.click(getByText('Preferences'));
    const checkbox = getByDisplayValue('original');

    fireEvent.click(checkbox);

    const checkboxes = await within(filterBlock).findAllByRole('checkbox');
    const unchecked = checkboxes.filter(({ value }) => value !== 'original');

    expect(checkbox).toBeChecked();
    unchecked.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('affects cards correctly', async () => {
    const mockData = loadFile('../../../fixtures/api/updated.json');
    api.setData('cards', mockData);
    const { findByRole, getByText, getByDisplayValue } = render(<App />);
    fireEvent.click(getByText('Preferences'));
    const pref = getByDisplayValue('original');
    const reprint = await findByRole('img');

    expect(reprint.src).toBe(`http://localhost${mockData[1].imagesrc}`);

    fireEvent.click(pref);
    const original = await findByRole('img');

    expect(original.src).toBe(`http://localhost${mockData[0].imagesrc}`);
  });
});

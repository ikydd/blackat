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
    const heading = within(filterBlock).getByText('Preferences');

    await waitFor(() => {
      expect(heading).toBeTruthy();
    });
  });

  it('starts with some checkboxes', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('preferences-filters');
    fireEvent.click(getByText('Preferences'));
    const checkboxes = within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes.length).toBeGreaterThan(0);
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

  describe('Prefer Original Art', () => {
    it('affects cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/updated.json');
      api.setData('cards', mockData);
      const { findByRole, getByText, getByDisplayValue } = render(<App />);
      fireEvent.click(getByText('Preferences'));
      const pref = getByDisplayValue('original');
      const reprint = await findByRole('img');

      await waitFor(() => {
        expect(reprint.src).toBe(`http://localhost${mockData[1].imagesrc}`);
      });

      fireEvent.click(pref);
      const original = await findByRole('img');
      await waitFor(() => {
        expect(original.src).toBe(`http://localhost${mockData[0].imagesrc}`);
      });
    });
  });
  describe('Official Packs Only', () => {
    it('filters cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/official.json');
      api.setData('cards', mockData);
      const { findAllByRole, getByText, getByDisplayValue } = render(<App />);
      fireEvent.click(getByText('Preferences'));
      const pref = getByDisplayValue('official');
      const images = await findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      fireEvent.click(pref);
      const filtered = await findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });
    it('filters options correctly', async () => {
      const { getByText, getByTestId, getByDisplayValue } = render(<App />);
      fireEvent.click(getByText('Preferences'));
      const pref = getByDisplayValue('official');
      fireEvent.click(pref);

      const filterBlock = getByTestId('packs-filters');
      fireEvent.click(getByText('Packs'));
      const filtered = await within(filterBlock).findAllByRole('checkbox');

      expect(filtered).toHaveLength(64);
    });
  });
  describe('Pack Legality', () => {
    it('filters rotated cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/rotated.json');
      api.setData('cards', mockData);
      const { findAllByRole, getByText, getByDisplayValue } = render(<App />);
      fireEvent.click(getByText('Preferences'));
      const pref = getByDisplayValue('rotation');
      const images = await findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      fireEvent.click(pref);
      const filtered = await findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });

    it('filters options correctly', async () => {
      const { getByText, getByTestId, getByDisplayValue } = render(<App />);
      fireEvent.click(getByText('Preferences'));
      const pref = getByDisplayValue('rotation');
      fireEvent.click(pref);

      const filterBlock = getByTestId('packs-filters');
      fireEvent.click(getByText('Packs'));
      const filtered = await within(filterBlock).findAllByRole('checkbox');

      expect(filtered).toHaveLength(30);
    });

    it('filters banned cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/banned.json');
      api.setData('cards', mockData);
      const { findAllByRole, getByText, getByDisplayValue } = render(<App />);
      fireEvent.click(getByText('Preferences'));
      const pref = getByDisplayValue('legal');
      const images = await findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      fireEvent.click(pref);
      const filtered = await findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });
  });
});

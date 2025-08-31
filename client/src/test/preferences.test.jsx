import React from 'react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

const loadFile = (path) => JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));

const getGordianBlades = (imgs) =>
  imgs.filter(({ alt }) => alt === 'Gordian Blade').map(({ src }) => src);

const getMockBlades = (mockData) => {
  const [{ imagesrc: blade1 }, , { imagesrc: blade2 }, , { imagesrc: blade3 }] = mockData;
  return [blade1, blade2, blade3];
};

jest.mock('../helpers/api');

describe('Preferences filters', () => {
  it('has the correct title', async () => {
    const { findByTestId } = render(<App />);
    const filterBlock = await findByTestId('preferences-filters');
    const heading = within(filterBlock).getByText('Preferences');

    await waitFor(() => {
      expect(heading).toBeTruthy();
    });
  });

  it('starts with some checkboxes', async () => {
    const { getByTestId, findByText } = render(<App />);
    const prefsButton = await findByText('Preferences');
    const filterBlock = getByTestId('preferences-filters');
    fireEvent.click(prefsButton);
    const checkboxes = within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId, findByText, getByDisplayValue } = render(<App />);
    const prefsButton = await findByText('Preferences');
    const filterBlock = getByTestId('preferences-filters');
    fireEvent.click(prefsButton);
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
    it('does not filter any out when they are not adjacent', async () => {
      const mockData = loadFile('../../../fixtures/api/updated.json');
      const [blade1, blade2, blade3] = getMockBlades(mockData);

      api.setData('cards', mockData);
      const { findByRole, findAllByRole, findByText } = render(<App />);

      const sort = await findByRole('combobox');
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);

      fireEvent.change(sort, { target: { value: 'pack' } });
      const sortedByPack = await findAllByRole('img');

      await waitFor(() => {
        expect(getGordianBlades(sortedByPack)).toEqual([
          expect.stringContaining(blade1),
          expect.stringContaining(blade2),
          expect.stringContaining(blade3)
        ]);
      });
    });

    it('selects most up-to-date card when unchecked', async () => {
      const mockData = loadFile('../../../fixtures/api/updated.json');
      const [, , blade3] = getMockBlades(mockData);

      api.setData('cards', mockData);
      const { findByRole, findAllByRole, findByText } = render(<App />);

      const sort = await findByRole('combobox');
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);

      fireEvent.change(sort, { target: { value: 'pack' } });
      fireEvent.change(sort, { target: { value: 'title' } });
      const sortedByTitle = await findAllByRole('img');

      await waitFor(() => {
        expect(getGordianBlades(sortedByTitle)).toEqual([expect.stringContaining(blade3)]);
      });
    });

    it('selects most oldest card when checked', async () => {
      const mockData = loadFile('../../../fixtures/api/updated.json');
      const [blade1] = getMockBlades(mockData);

      api.setData('cards', mockData);
      const { findByRole, findAllByRole, findByText, getByDisplayValue } = render(<App />);

      const sort = await findByRole('combobox');
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);
      const pref = getByDisplayValue('original');

      fireEvent.change(sort, { target: { value: 'pack' } });
      fireEvent.change(sort, { target: { value: 'title' } });
      fireEvent.click(pref);
      const preferOriginal = await findAllByRole('img');

      await waitFor(() => {
        expect(getGordianBlades(preferOriginal)).toEqual([expect.stringContaining(blade1)]);
      });
    });

    it('selects cards correctly when some are filtered out', async () => {
      const mockData = loadFile('../../../fixtures/api/updated.json');
      const [, blade2] = getMockBlades(mockData);

      api.setData('cards', mockData);
      const { findByRole, findAllByRole, findByText, getByDisplayValue, getByTestId } = render(
        <App />
      );

      const sort = await findByRole('combobox');
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);

      const pref = getByDisplayValue('original');
      fireEvent.change(sort, { target: { value: 'title' } });
      fireEvent.click(pref);

      const packsButton = await findByText('Packs');
      const filterBlock = getByTestId('packs-filters');
      fireEvent.click(packsButton);

      const trace = await within(filterBlock).findByLabelText('Trace Amount');
      const study = await within(filterBlock).findByLabelText('A Study in Static');
      fireEvent.click(trace);
      fireEvent.click(study);

      const filteredPacks = await findAllByRole('img');

      await waitFor(() => {
        expect(getGordianBlades(filteredPacks)).toEqual([expect.stringContaining(blade2)]);
      });
    });
  });

  describe('Official Packs Only', () => {
    it('filters cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/official.json');
      api.setData('cards', mockData);
      const { findAllByRole, findByText, getByDisplayValue } = render(<App />);
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);
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
      const { findByText, getByText, getByTestId, getByDisplayValue } = render(<App />);
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);
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
      const { findAllByRole, findByText, getByDisplayValue } = render(<App />);
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);
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
      const { findByText, getByText, getByTestId, getByDisplayValue } = render(<App />);
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);
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
      const { findAllByRole, findByText, getByDisplayValue } = render(<App />);
      const prefsButton = await findByText('Preferences');
      fireEvent.click(prefsButton);
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

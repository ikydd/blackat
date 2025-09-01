import React from 'react';
import { render, within, waitFor, screen } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';
import loadFile from './helpers/load-file';
import { setFilter, sortBy, openFilter } from './helpers/operations';

jest.mock('../helpers/api');

const getGordianBlades = async () =>
  (await screen.findAllByRole('img'))
    .filter(({ alt }) => alt === 'Gordian Blade')
    .map(({ src }) => src);

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
    const { getByTestId } = render(<App />);
    await openFilter('Preferences');

    const filterBlock = getByTestId('preferences-filters');
    const checkboxes = within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId } = render(<App />);
    const [checkbox] = await setFilter('Preferences', 'Prefer Original Art');

    const filterBlock = getByTestId('preferences-filters');
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
      render(<App />);

      await sortBy('pack');

      const images = await getGordianBlades();

      await waitFor(() => {
        expect(images).toEqual([
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
      render(<App />);

      await sortBy('title');
      const images = await getGordianBlades();

      await waitFor(() => {
        expect(images).toEqual([expect.stringContaining(blade3)]);
      });
    });

    it('selects most oldest card when checked', async () => {
      const mockData = loadFile('../../../fixtures/api/updated.json');
      const [blade1] = getMockBlades(mockData);

      api.setData('cards', mockData);
      render(<App />);

      await sortBy('title');
      await setFilter('Preferences', 'Prefer Original Art');

      const images = await getGordianBlades();

      await waitFor(() => {
        expect(images).toEqual([expect.stringContaining(blade1)]);
      });
    });

    it('selects cards correctly when some are filtered out', async () => {
      const mockData = loadFile('../../../fixtures/api/updated.json');
      const [, blade2] = getMockBlades(mockData);

      api.setData('cards', mockData);
      render(<App />);

      await sortBy('title');
      await setFilter('Preferences', 'Prefer Original Art');
      await setFilter('Packs', 'Trace Amount', 'A Study in Static');

      const images = await getGordianBlades();

      await waitFor(() => {
        expect(images).toEqual([expect.stringContaining(blade2)]);
      });
    });
  });

  describe('Official Packs Only', () => {
    it('filters cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/official.json');
      api.setData('cards', mockData);
      const { findAllByRole } = render(<App />);

      const images = await findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      await setFilter('Preferences', 'Classic Retail Packs');

      const filtered = await findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });

    it('filters options correctly', async () => {
      const { getByTestId } = render(<App />);
      await setFilter('Preferences', 'Classic Retail Packs');
      await openFilter('Packs');

      const filterBlock = getByTestId('packs-filters');
      const filtered = await within(filterBlock).findAllByRole('checkbox');

      expect(filtered).toHaveLength(64);
    });
  });
  describe('Pack Legality', () => {
    it('filters rotated cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/rotated.json');
      api.setData('cards', mockData);
      const { findAllByRole } = render(<App />);

      const images = await findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      await setFilter('Preferences', 'Current Rotation');

      const filtered = await findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });

    it('filters options correctly', async () => {
      const { getByTestId } = render(<App />);
      await setFilter('Preferences', 'Current Rotation');
      await openFilter('Packs');

      const filterBlock = getByTestId('packs-filters');
      const filtered = await within(filterBlock).findAllByRole('checkbox');

      expect(filtered).toHaveLength(30);
    });

    it('filters banned cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/banned.json');
      api.setData('cards', mockData);
      const { findAllByRole } = render(<App />);

      const images = await findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      await setFilter('Preferences', 'Latest Ban List');

      const filtered = await findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });
  });
});

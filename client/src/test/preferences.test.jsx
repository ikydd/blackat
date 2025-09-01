import React from 'react';
import { render, within, waitFor, screen } from '@testing-library/react';
import App from '../App';
import * as api from '../helpers/api';
import loadFile from './helpers/load-file';
import { filterBy, sortBy, clickFilter } from './helpers/operations';
import { findBlock, findCheckboxes } from './helpers/finders';

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
    render(<App />);
    const filterBlock = await findBlock('preferences');
    const heading = within(filterBlock).getByText('Preferences');

    await waitFor(() => {
      expect(heading).toBeTruthy();
    });
  });

  it('starts with some checkboxes', async () => {
    render(<App />);
    await clickFilter('Preferences');

    const checkboxes = await findCheckboxes('preferences');

    await waitFor(() => {
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  it('selects checkboxes correctly', async () => {
    render(<App />);
    const [checkbox] = await filterBy('Preferences', 'Prefer Original Art');

    const checkboxes = await findCheckboxes('preferences');
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
      await filterBy('Preferences', 'Prefer Original Art');

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
      await filterBy('Preferences', 'Prefer Original Art');
      await filterBy('Packs', 'Trace Amount', 'A Study in Static');

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
      render(<App />);

      const images = await screen.findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      await filterBy('Preferences', 'Classic Retail Packs');

      const filtered = await screen.findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });

    it('filters options correctly', async () => {
      render(<App />);
      await filterBy('Preferences', 'Classic Retail Packs');
      await clickFilter('Packs');

      const filtered = await findCheckboxes('packs');

      expect(filtered).toHaveLength(64);
    });
  });
  describe('Pack Legality', () => {
    it('filters rotated cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/rotated.json');
      api.setData('cards', mockData);
      render(<App />);

      const images = await screen.findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      await filterBy('Preferences', 'Current Rotation');

      const filtered = await screen.findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });

    it('filters options correctly', async () => {
      render(<App />);
      await filterBy('Preferences', 'Current Rotation');
      await clickFilter('Packs');

      const filtered = await findCheckboxes('packs');

      expect(filtered).toHaveLength(30);
    });

    it('filters banned cards correctly', async () => {
      const mockData = loadFile('../../../fixtures/api/banned.json');
      api.setData('cards', mockData);
      render(<App />);

      const images = await screen.findAllByRole('img');
      await waitFor(() => {
        expect(images).toHaveLength(2);
      });

      await filterBy('Preferences', 'Latest Ban List');

      const filtered = await screen.findAllByRole('img');
      await waitFor(() => {
        expect(filtered).toHaveLength(1);
      });
    });
  });
});

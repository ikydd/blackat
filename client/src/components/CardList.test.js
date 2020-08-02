import React from 'react';
import { render } from '@testing-library/react';
import CardList from './CardList';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('CardList', () => {
  let mockData = require('../../../fixtures/api/cards');

  beforeEach(() => {
    jest.spyOn(api, 'getData').mockImplementation(() => Promise.resolve(mockData));
  });

  it('renders without crashing', () => {
    render(<CardList/>);
  });

  it('renders with no cards to begin with', async () => {
    const { queryByRole } = render(<CardList/>);

    expect(queryByRole('img')).toBeFalsy();
  })

  it('uses api.getData correctly', () => {
    render(<CardList/>);

    expect(api.getData).toHaveBeenCalledWith('cards');
  });

  it('default to showing all cards', async () => {
    const { findAllByRole } = render(<CardList/>);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(7);
  });

  it('only shows cards from the correct side', async () => {
    const { findAllByRole } = render(<CardList side="runner" />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(3);
  });

  it('only shows cards from the correct factions', async () => {
    const factions = ['shaper'];
    const { findAllByRole } = render(<CardList factions={factions} />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(2);
  });

  it('only shows cards from the correct types', async () => {
    const types = ['program'];
    const { findAllByRole } = render(<CardList types={types} />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(2);
  });

  it('only shows cards from the correct packs', async () => {
    const packs = ['wla'];
    const { findAllByRole } = render(<CardList packs={packs} />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(2);
  });

  describe('Title Search', () => {
    it('only shows relevant cards given a search', async () => {
      const search = 'Blade';
      const { findByRole } = render(<CardList titleSearch={search} />);
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', "Gordian Blade");
    });

    it('is not case-sensitive', async () => {
      const search = 'blADE';
      const { findByRole } = render(<CardList titleSearch={search} />);
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', "Gordian Blade");
    });
  });

  describe('Text Search', () => {
    it('only shows relevant cards given a text search', async () => {
      const search = 'net damage';
      const { findAllByRole } = render(<CardList textSearch={search} />);
      const cards = await findAllByRole('img');
      const titles = cards.map((card) => card.getAttribute('alt'));

      expect(titles).toHaveLength(3);
      expect(titles).toEqual(['Chum', 'Data Mine', 'Neural Katana']);
    });

    it('is not case-sensitive', async () => {
      const search = 'NEt daMAge';
      const { findAllByRole } = render(<CardList textSearch={search} />);
      const cards = await findAllByRole('img');
      const titles = cards.map((card) => card.getAttribute('alt'));

      expect(titles).toHaveLength(3);
      expect(titles).toEqual(['Chum', 'Data Mine', 'Neural Katana']);
    });
  })

  describe('Sort', () => {
    describe('Faction', () => {
      it('sorts by faction', async () => {
        mockData = require('../../../fixtures/api/sort-faction');
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Mandatory Upgrades", "Chum"]);
      });

      it('sorts neutral last', async () => {
        mockData = require('../../../fixtures/api/sort-faction-neutral');
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Gordian Blade", "Sure Gamble"]);
      });

      it('sorts by type after faction', async () => {
        mockData = require('../../../fixtures/api/sort-faction-type');
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Gordian Blade", "R&D Interface", ]);
      });

      it('sorts by alpha after type', async () => {
        mockData = require('../../../fixtures/api/sort-faction-type-alpha');
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Chum", "Data Mine"]);
      });
    });
  })
});

import React from 'react';
import { render } from '@testing-library/react';
import CardList from './CardList';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('CardList', () => {
  afterEach(() => {
    api.reset();
  })
  it('renders without crashing', () => {
    render(<CardList/>);
  });

  it('renders with no cards to begin with', async () => {
    const { queryByRole } = render(<CardList/>);

    expect(queryByRole('img')).toBeFalsy();
  })

  it('defaults to showing all cards', async () => {
    const { findAllByRole } = render(<CardList/>);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(7);
  });

  describe('Filter', () => {
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

    it('only shows cards from the correct subtypes', async () => {
      const subtypes = ['Icebreaker'];
      const { findByRole } = render(<CardList subtypes={subtypes} />);
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', 'Gordian Blade');
    });

    it('only shows cards from the correct packs', async () => {
      const packs = ['wla'];
      const { findAllByRole } = render(<CardList packs={packs} />);
      const cards = await findAllByRole('img');

      expect(cards).toHaveLength(2);
    });
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
        api.setData('cards', require('../../../fixtures/api/faction-sort/faction-corp'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Mandatory Upgrades", "Chum"]);
      });

      it('sorts neutral last', async () => {
        api.setData('cards', require('../../../fixtures/api/faction-sort/faction-neutral'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Gordian Blade", "Sure Gamble"]);
      });

      it('sorts by type after faction', async () => {
        api.setData('cards', require('../../../fixtures/api/faction-sort/faction-type'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Gordian Blade", "R&D Interface", ]);
      });

      it('sorts by name after type', async () => {
        api.setData('cards', require('../../../fixtures/api/faction-sort/faction-type-name'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Chum", "Data Mine"]);
      });

      it('has named separators', async () => {
        api.setData('cards', require('../../../fixtures/api/faction-sort/faction-corp'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const hrs = await findAllByRole('separator');
        const titles = hrs.map(({ textContent }) => textContent.trim());

        expect(titles).toEqual(["Haas-Bioroid", "Jinteki"]);
      });
    });

    describe('Type', () => {
      it('sorts by type', async () => {
        api.setData('cards', require('../../../fixtures/api/type-sort/runner'));
        const { findAllByRole } = render(<CardList sort="type" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['R&D Interface', "All-nighter"]);
      });

      it('sorts by faction after type', async () => {
        api.setData('cards', require('../../../fixtures/api/type-sort/type-faction'));
        const { findAllByRole } = render(<CardList sort="type" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Ichi 1.0', 'Chum']);
      });

      it('sorts by name after faction', async () => {
        api.setData('cards', require('../../../fixtures/api/type-sort/type-faction-name'));
        const { findAllByRole } = render(<CardList sort="type" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Battering Ram', 'Gordian Blade']);
      });

      it('has named separators', async () => {
        api.setData('cards', require('../../../fixtures/api/type-sort/runner'));
        const { findAllByRole } = render(<CardList sort="type" />);
        const hrs = await findAllByRole('separator');
        const titles = hrs.map(({ textContent }) => textContent.trim());

        expect(titles).toEqual(["Hardware", "Resource"]);
      });
    });


    describe('Pack', () => {
      it('sorts by pack', async () => {
        api.setData('cards', require('../../../fixtures/api/pack-sort/runner'));
        const { findAllByRole } = render(<CardList sort="pack" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Gordian Blade', 'R&D Interface']);
      });

      it('has named separators', async () => {
        api.setData('cards', require('../../../fixtures/api/pack-sort/runner'));
        const { findAllByRole } = render(<CardList sort="pack" />);
        const hrs = await findAllByRole('separator');
        const titles = hrs.map(({ textContent }) => textContent.trim());

        expect(titles).toEqual(["Core Set", "Future Proof"]);
      });
    });

    describe('Title', () => {
      it('sorts by title', async () => {
        api.setData('cards', require('../../../fixtures/api/cards-name'));
        const { findAllByRole } = render(<CardList sort="title" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(["Chum", "Mandatory Upgrades"]);
      });

      it('has no separators', async () => {
        api.setData('cards', require('../../../fixtures/api/cards-name'));
        const { findAllByRole, queryAllByRole } = render(<CardList sort="title" />);
        await findAllByRole('img');
        const hrs = queryAllByRole('separator');

        expect(hrs).toHaveLength(0);
      });
    });
  })

  describe('Card Updates', () => {
    it('only shows the most recent version when versions are consecutive', async () => {
      api.setData('cards', require('../../../fixtures/api/versions'));
      const { findAllByRole } = render(<CardList sort="title" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(["Gordian Blade", "Magnum Opus"]);
    });

    it('shows all versions when not consecutive', async () => {
      api.setData('cards', require('../../../fixtures/api/versions'));
      const { findAllByRole } = render(<CardList sort="pack" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(["Gordian Blade", "Magnum Opus", "Gordian Blade"]);
    });
  });

  describe('Loading Spinner', () => {
    it('starts with a loading icon', () => {
        const { getByRole } = render(<CardList />);
        const spinner = getByRole('progressbar');

        expect(spinner).toBeTruthy();
    });

    it('hides the spinner once the cards are loaded', async () => {
        const { queryByRole, findAllByRole } = render(<CardList />);
        await findAllByRole('img');
        const spinner = queryByRole('progressbar');

        expect(spinner).toBeFalsy();
    });

    it('does not show the spinner when no cards are found', async () => {
        const search = 'xxx';
        const { queryByRole, findAllByRole, rerender } = render(<CardList />);
        await findAllByRole('img');

        rerender(<CardList textSearch={search}/>)
        const spinner = queryByRole('progressbar');

        expect(spinner).toBeFalsy();
    });
  });

  describe('Empty message', () => {
    it('shows a message when no cards are found', () => {
      const search = 'xxx';
      const { getByRole } = render(<CardList textSearch={search} />);
      const message = getByRole('alert');

      expect(message).toBeTruthy();
    });
  });
});

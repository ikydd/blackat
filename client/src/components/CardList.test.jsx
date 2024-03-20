import React from 'react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { render, waitFor } from '@testing-library/react';
import CardList from './CardList';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

const loadFile = (path) => JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));

describe('CardList', () => {
  afterEach(() => {
    api.reset();
  });
  it('renders without crashing', async () => {
    await waitFor(() => {
      expect(() => render(<CardList />)).not.toThrow();
    });
  });

  it('renders with no cards to begin with', async () => {
    const { queryByRole } = render(<CardList />);

    await waitFor(() => {
      expect(queryByRole('img')).toBeFalsy();
    });
  });

  it('defaults to showing all cards', async () => {
    const { findAllByRole } = render(<CardList />);
    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(8);
  });

  describe('Filter', () => {
    it('only shows cards from the correct side', async () => {
      const { findAllByRole } = render(<CardList side="runner" />);
      const cards = await findAllByRole('img');

      expect(cards).toHaveLength(4);
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

    it('only shows official cards', async () => {
      const { findAllByRole } = render(<CardList official={true} />);
      const cards = await findAllByRole('img');

      expect(cards).toHaveLength(7);
    });

    it('only shows un-rotated cards', async () => {
      const { findAllByRole } = render(<CardList rotation={true} />);
      const cards = await findAllByRole('img');

      expect(cards).toHaveLength(2);
    });

    it('only shows un-banned cards', async () => {
      const { findAllByRole } = render(<CardList legal={true} />);
      const cards = await findAllByRole('img');

      expect(cards).toHaveLength(4);
    });
  });

  describe('Title Search', () => {
    it('only shows relevant cards given a search', async () => {
      const search = 'Blade';
      const { findByRole } = render(<CardList titleSearch={search} />);
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', 'Gordian Blade');
    });

    it('is not case-sensitive', async () => {
      const search = 'blADE';
      const { findByRole } = render(<CardList titleSearch={search} />);
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', 'Gordian Blade');
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
  });

  describe('Sort', () => {
    describe('Faction', () => {
      it('sorts by faction', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-corp.json'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Mandatory Upgrades', 'Chum']);
      });

      it('sorts neutral last', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-neutral.json'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Gordian Blade', 'Sure Gamble']);
      });

      it('sorts by type after faction', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-type.json'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Gordian Blade', 'R&D Interface']);
      });

      it('sorts by name after type', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-type-name.json'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Chum', 'Data Mine']);
      });

      it('has named separators', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/faction-sort/faction-corp.json'));
        const { findAllByRole } = render(<CardList sort="faction" />);
        await findAllByRole('img');

        const hrs = await findAllByRole('heading');
        const titles = hrs.map(({ textContent }) => textContent.trim());

        await waitFor(() => {
          expect(titles).toEqual([expect.any(String), 'Haas-Bioroid', 'Jinteki']);
        });
      });
    });

    describe('Type', () => {
      it('sorts by type', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/type-sort/runner.json'));
        const { findAllByRole } = render(<CardList sort="type" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['R&D Interface', 'All-nighter']);
      });

      it('sorts by faction after type', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/type-sort/type-faction.json'));
        const { findAllByRole } = render(<CardList sort="type" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Ichi 1.0', 'Chum']);
      });

      it('sorts by name after faction', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/type-sort/type-faction-name.json'));
        const { findAllByRole } = render(<CardList sort="type" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Battering Ram', 'Gordian Blade']);
      });

      it('has named separators', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/type-sort/runner.json'));
        const { findAllByRole } = render(<CardList sort="type" />);
        await findAllByRole('img');
        const hrs = await findAllByRole('heading');
        const titles = hrs.map(({ textContent }) => textContent.trim());

        expect(titles).toEqual([expect.any(String), 'Hardware', 'Resource']);
      });
    });

    describe('Pack', () => {
      it('sorts by pack', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/pack-sort/runner.json'));
        const { findAllByRole } = render(<CardList sort="pack" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Gordian Blade', 'R&D Interface']);
      });

      it('has named separators', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/pack-sort/runner.json'));
        const { findAllByRole } = render(<CardList sort="pack" />);
        await findAllByRole('img');

        const hrs = await findAllByRole('heading');
        const titles = hrs.map(({ textContent }) => textContent.trim());

        expect(titles).toEqual([expect.any(String), 'Core Set', 'Future Proof']);
      });
    });

    describe('Title', () => {
      it('sorts by title', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/cards-name.json'));
        const { findAllByRole } = render(<CardList sort="title" />);
        const images = await findAllByRole('img');
        const cards = images.map(({ alt }) => alt);

        expect(cards).toEqual(['Chum', 'Mandatory Upgrades']);
      });

      it('has no separators', async () => {
        api.setData('cards', loadFile('../../../fixtures/api/cards-name.json'));
        const { findAllByRole, queryAllByRole } = render(<CardList sort="title" />);
        await findAllByRole('img');
        const hrs = queryAllByRole('heading');

        expect(hrs).toHaveLength(1);
      });
    });
  });

  describe('Illustrator', () => {
    it('sorts by illustrator', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/illustrator-sort/illustrator.json'));
      const { findAllByRole } = render(<CardList sort="illustrator" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['ZU.13 Key Master', 'Mandatory Upgrades']);
    });

    it('skips cards with no illustrator', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/illustrator-sort/no-illustrator.json'));
      const { findAllByRole } = render(<CardList sort="illustrator" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Mandatory Upgrades']);
    });

    it('has named separators', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/illustrator-sort/illustrator.json'));
      const { findAllByRole } = render(<CardList sort="illustrator" />);
      await findAllByRole('img');

      const hrs = await findAllByRole('heading');
      const titles = hrs.map(({ textContent }) => textContent.trim());

      expect(titles).toEqual([expect.any(String), 'Liiga Smilshkalne', 'Mauricio Herrera']);
    });

    it('sorts by title after illustrator', async () => {
      api.setData(
        'cards',
        loadFile('../../../fixtures/api/illustrator-sort/illustrator-title.json')
      );
      const { findAllByRole } = render(<CardList sort="illustrator" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Uroboros', 'ZU.13 Key Master']);
    });
  });

  describe('Cost', () => {
    it('sorts by cost', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/cost-sort/cost.json'));
      const { findAllByRole } = render(<CardList sort="cost" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('skips cards with no cost', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/cost-sort/no-cost.json'));
      const { findAllByRole } = render(<CardList sort="cost" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo']);
    });

    it('includes cards with 0 cost', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/cost-sort/zero-cost.json'));
      const { findAllByRole } = render(<CardList sort="cost" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar', 'Foo']);
    });

    it('sorts by faction after cost', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/cost-sort/cost-faction.json'));
      const { findAllByRole } = render(<CardList sort="cost" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar', 'Foo']);
    });

    it('sorts by type after faction', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/cost-sort/cost-faction-type.json'));
      const { findAllByRole } = render(<CardList sort="cost" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('sorts by title after type', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/cost-sort/cost-faction-type-name.json'));
      const { findAllByRole } = render(<CardList sort="cost" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar', 'Foo']);
    });
  });

  describe('Agenda Points', () => {
    it('sorts by agenda points', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/agenda.json'));
      const { findAllByRole } = render(<CardList sort="agenda" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('skips cards with no agenda points', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/no-agenda.json'));
      const { findAllByRole } = render(<CardList sort="agenda" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar']);
    });

    it('includes cards with 0 points', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/zero-agenda.json'));
      const { findAllByRole } = render(<CardList sort="agenda" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar', 'Foo']);
    });

    it('sorts by faction after agenda points', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/agenda-faction.json'));
      const { findAllByRole } = render(<CardList sort="agenda" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('sorts by advancement cost after faction', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/agenda-faction-cost.json'));
      const { findAllByRole } = render(<CardList sort="agenda" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('sorts by title after advancement', async () => {
      api.setData(
        'cards',
        loadFile('../../../fixtures/api/agenda-sort/agenda-faction-cost-name.json')
      );
      const { findAllByRole } = render(<CardList sort="agenda" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar', 'Foo']);
    });

    it('includes cards that act as agenda points', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/agenda-sort/as-an-agenda.json'));
      const { findAllByRole } = render(<CardList sort="agenda" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });
  });

  describe('Strength', () => {
    it('sorts by strength', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/strength-sort/strength.json'));
      const { findAllByRole } = render(<CardList sort="strength" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('skips cards with no strength', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/strength-sort/no-strength.json'));
      const { findAllByRole } = render(<CardList sort="strength" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar']);
    });

    it('includes cards with 0 strength', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/strength-sort/zero-strength.json'));
      const { findAllByRole } = render(<CardList sort="strength" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('sorts by subroutines after strength', async () => {
      api.setData(
        'cards',
        loadFile('../../../fixtures/api/strength-sort/strength-subroutines.json')
      );
      const { findAllByRole } = render(<CardList sort="strength" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('sorts by title after subroutines', async () => {
      api.setData(
        'cards',
        loadFile('../../../fixtures/api/strength-sort/strength-subroutines-name.json')
      );
      const { findAllByRole } = render(<CardList sort="strength" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar', 'Foo']);
    });
  });

  describe('Subroutines', () => {
    it('sorts by subroutines', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/subroutines-sort/subroutines.json'));
      const { findAllByRole } = render(<CardList sort="subroutines" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('skips cards with no subroutines', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/subroutines-sort/no-subroutines.json'));
      const { findAllByRole } = render(<CardList sort="subroutines" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar']);
    });

    it('includes cards with 0 subroutines', async () => {
      api.setData(
        'cards',
        loadFile('../../../fixtures/api/subroutines-sort/zero-subroutines.json')
      );
      const { findAllByRole } = render(<CardList sort="subroutines" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('sorts by strength after subroutines', async () => {
      api.setData(
        'cards',
        loadFile('../../../fixtures/api/subroutines-sort/subroutines-strength.json')
      );
      const { findAllByRole } = render(<CardList sort="subroutines" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Foo', 'Bar']);
    });

    it('sorts by title after strength', async () => {
      api.setData(
        'cards',
        loadFile('../../../fixtures/api/subroutines-sort/subroutines-strength-name.json')
      );
      const { findAllByRole } = render(<CardList sort="subroutines" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Bar', 'Foo']);
    });
  });

  describe('Card Updates', () => {
    it('only shows the oldest version when versions are consecutive', async () => {
      const cardData = loadFile('../../../fixtures/api/versions.json');
      api.setData('cards', cardData);
      const { findAllByRole } = render(<CardList sort="title" art="original" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Gordian Blade', 'Magnum Opus']);
      expect(images[0].src).toEqual(cardData[0].imagesrc);
    });

    it('only shows the most recent version when versions are consecutive', async () => {
      const cardData = loadFile('../../../fixtures/api/versions.json');
      api.setData('cards', cardData);
      const { findAllByRole } = render(<CardList sort="title" art="updated" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Gordian Blade', 'Magnum Opus']);
      expect(images[0].src).toEqual(cardData[2].imagesrc);
    });

    it('only shows the most recent version when versions by default', async () => {
      const cardData = loadFile('../../../fixtures/api/versions.json');
      api.setData('cards', cardData);
      const { findAllByRole } = render(<CardList sort="title" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Gordian Blade', 'Magnum Opus']);
      expect(images[0].src).toEqual(cardData[2].imagesrc);
    });

    it('shows all versions when not consecutive', async () => {
      api.setData('cards', loadFile('../../../fixtures/api/versions.json'));
      const { findAllByRole } = render(<CardList sort="pack" />);
      const images = await findAllByRole('img');
      const cards = images.map(({ alt }) => alt);

      expect(cards).toEqual(['Gordian Blade', 'Magnum Opus', 'Gordian Blade']);
    });
  });

  describe('Loading Spinner', () => {
    it('starts with a loading icon', async () => {
      const { getByRole } = render(<CardList />);
      const spinner = getByRole('progressbar');

      await waitFor(() => {
        expect(spinner).toBeTruthy();
      });
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

      rerender(<CardList textSearch={search} />);
      const spinner = queryByRole('progressbar');

      expect(spinner).toBeFalsy();
    });
  });

  describe('Empty message', () => {
    it('starts with no empty message', async () => {
      const { queryByRole } = render(<CardList />);
      const message = queryByRole('alert');

      await waitFor(() => {
        expect(message).toBeFalsy();
      });
    });

    it('shows a message when no cards are found', async () => {
      const search = 'no cards with this text';
      const { findAllByRole, rerender, getByRole } = render(<CardList />);
      await findAllByRole('img');

      rerender(<CardList textSearch={search} />);
      const message = getByRole('alert');

      expect(message).toBeTruthy();
    });
  });
});

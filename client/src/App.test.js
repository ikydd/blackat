import React from 'react';
import { render, within, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('./helpers/api', () => ({
  getData: async (type) => {
    switch (type) {
      case 'cards':
          return require('../../fixtures/api/cards');
      case 'factions':
          return require('../../fixtures/api/factions');
      case 'types':
          return require('../../fixtures/api/types');
      case 'packs':
          return require('../../fixtures/api/packs');
      default:
          throw new Error('unknown data request');
    }
  }
}));


it('renders without crashing', () => {
  render(<App />);
});

it('contains the cards', async () => {
  const { findAllByRole } = render(<App />);
  const cards = await findAllByRole('img');

  expect(cards).toHaveLength(3);
});

describe('Side Selection', () => {
  it('contains both sides', () => {
    const { getByTestId } = render(<App />);
    const sides = within(getByTestId('sides'))
      .getAllByRole('button')

    expect(sides[0]).toHaveTextContent("Runner");
    expect(sides[1]).toHaveTextContent("Corp");
  });

  it('starts on the runner side', () => {
    const { getByText } = render(<App />);

    expect(getByText("Runner")).toHaveClass('selected');
    expect(getByText("Corp")).not.toHaveClass('selected');
  });

  it('selects the correct SideButtons when corp is selected', () => {
    const { getByText } = render(<App />);

    fireEvent.click(getByText("Corp"));

    expect(getByText("Runner")).not.toHaveClass("selected");
    expect(getByText("Corp")).toHaveClass("selected");
  });

  it('selects the correct SideButtons when runner is selected', () => {
    const { getByText } = render(<App />);

    fireEvent.click(getByText("Corp"));
    fireEvent.click(getByText("Runner"));

    expect(getByText("Runner")).toHaveClass("selected");
    expect(getByText("Corp")).not.toHaveClass("selected");
  });

  it('only shows cards from the correct side', async () => {
    const { findAllByRole, getByText } = render(<App />);
    fireEvent.click(getByText("Corp"));

    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(4);
  });
});

describe('Searches boxes', () => {
  it('has two search boxes', () => {
    const { getAllByRole } = render(<App />);

    expect(getAllByRole('textbox')).toHaveLength(2);
  })

  describe('Title Search', () => {
    it(`has a text search`, () => {
      const { getByPlaceholderText } = render(<App />);

      expect(getByPlaceholderText(`search title`)).toBeTruthy();
    });

    it('only shows relevant cards given a title search', async () => {
      const search = 'Blade';
      const { getByPlaceholderText, findByRole } = render(<App />);
      const input = getByPlaceholderText(`search title`);
      fireEvent.input(input, { target: { value: search } });
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', "Gordian Blade");
    });
  });

  describe('Text Search', () => {
    it(`has title search`, () => {
      const { getByPlaceholderText } = render(<App />);

      expect(getByPlaceholderText(`search text`)).toBeTruthy();
    });

    it('only shows relevant cards given a text search', async () => {
      const search = 'remainder';
      const { getByPlaceholderText, findByRole } = render(<App />);
      const input = getByPlaceholderText(`search text`);
      fireEvent.input(input, { target: { value: search } });
      const card = await findByRole('img');

      expect(card).toHaveAttribute('alt', "Gordian Blade");
    });
  });
});

describe('Filters', () => {
  const filters = [
    {
      title: 'Factions',
      keyword: 'factions',
      runner: 3,
      corp: 2
    },
    {
      title: 'Types',
      keyword: 'types',
      runner: 5,
      corp: 6
    },
    {
      title: 'Packs',
      keyword: 'packs',
      runner: 8,
      corp: 8
    }
  ];
  filters.forEach(({ title, keyword, runner, corp }, index) => {
    describe(`${keyword} filters`, () => {
      it('loads some checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId(`${keyword}-filters`);
        const checkboxes = await within(filterBlock)
          .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(runner);
      });

      it('starts with empty checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId(`${keyword}-filters`);
        const checkboxes = await within(filterBlock)
          .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
          expect(box).not.toBeChecked();
        })
      });

      it('loads some checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId(`${keyword}-filters`);
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
          .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(corp);
      });

      it('starts with empty checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId(`${keyword}-filters`);
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
          .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
          expect(box).not.toBeChecked();
        })
      });

      it('has the correct title', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId(`${keyword}-filters`);
        const heading = await within(filterBlock)
          .findByRole('heading');

        expect(heading).toHaveTextContent(title);
      });

      it('selects checkboxes correctly', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId(`${keyword}-filters`);
        const unchecked = await within(filterBlock)
          .findAllByRole('checkbox');

        fireEvent.click(unchecked[0]);

        const checked = await within(filterBlock)
          .findAllByRole('checkbox');

        expect(checked[0]).toBeChecked();
      });
    });

    describe('Faction filtering', () => {
      it('filters cards correctly', async () => {
        const { getByTestId, findAllByRole, findByRole } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        const unchecked = await within(filterBlock)
          .findByLabelText('Anarch');
        const all = await findAllByRole('img');

        expect(all).toHaveLength(3);

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        expect(filtered).toHaveAttribute('alt', 'D4v1d');
      });

      it('retains filters from each side', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('factions-filters');

        let anarch = await within(filterBlock)
          .findByLabelText('Anarch');
        fireEvent.click(anarch);
        fireEvent.click(getByText('Corp'));

        let jinteki = await within(filterBlock)
          .findByLabelText('Jinteki');
        fireEvent.click(jinteki);
        fireEvent.click(getByText('Runner'));

        anarch = await within(filterBlock)
          .findByLabelText('Anarch');

        expect(anarch).toBeChecked();
      });
    });

    describe('Types filtering', () => {
      it('filters cards correctly', async () => {
        const { getByTestId, findAllByRole, findByRole } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        const unchecked = await within(filterBlock)
          .findByLabelText('Hardware');
        const all = await findAllByRole('img');

        expect(all).toHaveLength(3);

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        expect(filtered).toHaveAttribute('alt', 'R&D Interface');
      });

      it('retains filters from each side', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('types-filters');

        let hardware = await within(filterBlock)
          .findByLabelText('Hardware');
        fireEvent.click(hardware);
        fireEvent.click(getByText('Corp'));

        let agenda = await within(filterBlock)
          .findByLabelText('Agenda');
        fireEvent.click(agenda);
        fireEvent.click(getByText('Runner'));

        hardware = await within(filterBlock)
          .findByLabelText('Hardware');

        expect(hardware).toBeChecked();
      });
    });

    describe('Packs filtering', () => {
      it('filters cards correctly', async () => {
        const { getByTestId, findAllByRole, findByRole } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const unchecked = await within(filterBlock)
          .findByLabelText('What Lies Ahead');
        const all = await findAllByRole('img');

        expect(all).toHaveLength(3);

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        expect(filtered).toHaveAttribute('alt', 'D4v1d');
      });

      it('retains filters from each side', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');

        let runner = await within(filterBlock)
          .findByLabelText('What Lies Ahead');
        fireEvent.click(runner);
        fireEvent.click(getByText('Corp'));

        let corp = await within(filterBlock)
          .findByLabelText('Future Proof');
        fireEvent.click(corp);
        fireEvent.click(getByText('Runner'));

        runner = await within(filterBlock)
          .findByLabelText('What Lies Ahead');

        expect(runner).toBeChecked();
      });
    });
  });
});

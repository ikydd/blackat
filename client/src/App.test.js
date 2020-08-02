import React from 'react';
import { shallow } from 'enzyme';
import { render, within, fireEvent } from '@testing-library/react';
import { create } from 'react-test-renderer';
import App from './App';
import ControlPanel from './components/ControlPanel';
import FilterList from './components/FilterList';
import TextSearch from './components/TextSearch';
import SideButton from './components/SideButton';
import CardList from './components/CardList';

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

it('contains the ControlPanel', () => {
  const renderer = create(<App />);

  expect(renderer.root.findAllByType(ControlPanel).length).toEqual(1);
});

it('contains the CardList', () => {
  const renderer = create(<App />);

  expect(renderer.root.findAllByType(CardList).length).toEqual(1);
});

describe('Side Selection', () => {
  it('contains two sides', () => {
    const renderer = create(<App />);

    expect(renderer.root.findAllByType(SideButton).length).toEqual(2);
  });

  it('starts on the runner side', () => {
    const { getByText } = render(<App />);

    expect(getByText("Runner")).toHaveClass('selected');
    expect(getByText("Corp")).not.toHaveClass('selected');
  });

  it('has Runner as the first side', () => {
    const { getByTestId } = render(<App />);
    const headings = within(getByTestId('sides')).getAllByRole("button");

    expect(headings[0]).toHaveTextContent('Runner');
  });

  it('has Corp as the second side', () => {
    const { getByTestId } = render(<App />);
    const headings = within(getByTestId('sides')).getAllByRole("button");

    expect(headings[1]).toHaveTextContent('Corp');
  });

  it('selects the right SideButtons when corp is selected', () => {
    const { getByText } = render(<App />);

    fireEvent.click(getByText("Corp"));

    expect(getByText("Runner")).not.toHaveClass("selected");
    expect(getByText("Corp")).toHaveClass("selected");
  });

  it('selects the right SideButtons when runner is selected', () => {
    const { getByText } = render(<App />);

    fireEvent.click(getByText("Corp"));
    fireEvent.click(getByText("Runner"));

    expect(getByText("Runner")).toHaveClass("selected");
    expect(getByText("Corp")).not.toHaveClass("selected");
  });

  it('sends the appropriate prop to CardList when selected', () => {
    const component = shallow(<App />);
    component.find(SideButton).at(0).prop('onSelect')("foo");

    expect(component.find(CardList).prop('side')).toEqual("foo");
  });
});

describe('Searches',  () => {
  const searches = [
    {
      keyword: 'title'
    },
    {
      keyword: 'text'
    }
  ];

  searches.forEach(({ keyword }, index) => {
    it(`contains an instance of ${keyword} correct search`, () => {
      const renderer = create(<App />);

      expect(renderer.root.findAllByType(TextSearch)[index]).toBeTruthy();
    });

    it(`passes a placeholder to the ${keyword} TextSearch`, () => {
      const { getByPlaceholderText } = render(<App />);

      expect(getByPlaceholderText(`search ${keyword}`)).toBeTruthy();
    });

    it('sends the appropriate prop to CardList on change', () => {
      const component = shallow(<App />);
      component.find(TextSearch).at(index).prop('onChange')(["foo"]);

      expect(component.find(CardList).prop(`${keyword}Search`)).toEqual(["foo"]);
    });
  })
});

describe('Filters', () => {
  const filters = [
    {
      title: 'Factions',
      keyword: 'factions'
    },
    {
      title: 'Types',
      keyword: 'types'
    },
    {
      title: 'Packs',
      keyword: 'packs'
    }
  ];
  filters.forEach(({ title, keyword }, index) => {
    describe(`${title} filter`, () => {
      it('starts with no filters selected', () => {
        const instance = shallow(<App />).instance();

        expect(instance.getFilter(keyword, 'runner')).toEqual([]);
        expect(instance.getFilter(keyword, 'corp')).toEqual([]);
      });

      it('contains a instance of the filter', () => {
        const component = shallow(<App />);

        expect(component.find(FilterList).at(index).prop('title')).toEqual(title);
      });

      it(`uses the ${keyword} dataType`, () => {
        const component = shallow(<App />);

        expect(component.find(FilterList).at(index).prop('dataType')).toEqual(keyword);
      });

      it(`passes a ${keyword} selection callback to the FilterList`, () => {
        const component = shallow(<App />);

        expect(component.find(FilterList).at(index).prop('onChange')).toEqual(expect.any(Function));
      });

      it('sends the appropriate prop to FilterList when selected', () => {
        const component = shallow(<App />);
        component.find(FilterList).at(index).prop('onChange')(["foo"]);

        expect(component.find(FilterList).at(index).prop('selected')).toEqual(["foo"]);
      });

      it('sends the appropriate prop to FilterList when changing sides', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        instance.setFilter(keyword, ['foo'], 'runner');
        instance.setFilter(keyword, ['bar'], 'corp');
        instance.setSide('runner');

        expect(component.find(FilterList).at(index).prop('selected')).toEqual(["foo"]);

        instance.setSide('corp');

        expect(component.find(FilterList).at(index).prop('selected')).toEqual(["bar"]);

      });

      it('retains selected filter when changing sides and filter selection', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        instance.setFilter(keyword, [], 'runner');
        instance.setFilter(keyword, ['bar'], 'corp');
        instance.setSide('runner');
        component.find(FilterList).at(index).prop('onChange')(["foo"]);
        instance.setSide('corp');

        expect(component.find(FilterList).at(index).prop('selected')).toEqual(["bar"]);

      });

      it('sends the appropriate prop to CardList when selected', () => {
        const component = shallow(<App />);
        component.find(FilterList).at(index).prop('onChange')(["foo"]);

        expect(component.find(CardList).prop(keyword)).toEqual(["foo"]);
      });
    });
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from './App';
import ControlPanel from './components/ControlPanel';
import FilterList from './components/FilterList';
import SideButton from './components/SideButton';
import CardList from './components/CardList';

jest.mock('./components/ControlPanel');
jest.mock('./components/CardList');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('contains the ControlPanel', () => {
  const component = shallow(<App />);

  expect(component.find(ControlPanel).length).toEqual(1);
});

it('contains the CardList', () => {
  const component = shallow(<App />);

  expect(component.find(CardList).length).toEqual(1);
});

describe('Side Selection', () => {
  it('starts on the runner side', () => {
    const instance = shallow(<App />).instance();

    expect(instance.getSide()).toEqual("runner");
  });

  it('contains two sides', () => {
    const component = shallow(<App />);

    expect(component.find(SideButton).length).toEqual(2);
  });

  it('has Runner as the first side', () => {
    const component = shallow(<App />);

    expect(component.find(SideButton).at(0).prop('title')).toEqual('Runner');
    expect(component.find(SideButton).at(0).prop('side')).toEqual('runner');
  });

  it('has Corp as the second side', () => {
    const component = shallow(<App />);

    expect(component.find(SideButton).at(1).prop('title')).toEqual('Corp');
    expect(component.find(SideButton).at(1).prop('side')).toEqual('corp');
  });

  it('passes a callback through to the SideButtons', () => {
    const component = shallow(<App />);
    const instance = component.instance();

    expect(component.find(SideButton).at(0).prop('onSelect')).toEqual(instance.setSide);
    expect(component.find(SideButton).at(1).prop('onSelect')).toEqual(instance.setSide);
  });

  it('set props on the SideButtons as a result of initial state', () => {
    const component = shallow(<App />);

    expect(component.find(SideButton).at(0).prop('selected')).toEqual(true);
    expect(component.find(SideButton).at(1).prop('selected')).toEqual(false);
  });

  it('selects the right SideButtons when corp is selected', () => {
    const component = shallow(<App />);
    component.instance().setSide("runner");
    component.find(SideButton).at(0).prop('onSelect')("corp");

    expect(component.find(SideButton).at(0).prop('selected')).toEqual(false);
    expect(component.find(SideButton).at(1).prop('selected')).toEqual(true);
  });

  it('selects the right SideButtons when runner is selected', () => {
    const component = shallow(<App />);
    component.instance().setSide("corp");
    component.find(SideButton).at(0).prop('onSelect')("runner");

    expect(component.find(SideButton).at(0).prop('selected')).toEqual(true);
    expect(component.find(SideButton).at(1).prop('selected')).toEqual(false);
  });

  it('sends the appropriate prop to CardList when selected', () => {
    const component = shallow(<App />);
    component.find(SideButton).at(0).prop('onSelect')("foo");

    expect(component.find(CardList).prop('side')).toEqual("foo");
  });
});

describe('Faction Selection', () => {
  it('starts with no factions selected', () => {
    const instance = shallow(<App />).instance();

    expect(instance.getFactions('runner')).toEqual([]);
    expect(instance.getFactions('corp')).toEqual([]);
  });

  it('contains a factions filter', () => {
    const component = shallow(<App />);

    expect(component.find(FilterList).length).toEqual(1);
  });

  it('pass a faction selection callback to the FilterList', () => {
    const component = shallow(<App />);
    const instance = component.instance();

    expect(component.find(FilterList).prop('onChange')).toEqual(instance.setFactions);
  });

  it('sends the appropriate prop to FilterList when selected', () => {
    const component = shallow(<App />);
    component.find(FilterList).prop('onChange')(["foo"]);


    expect(component.find(FilterList).prop('selected')).toEqual(["foo"]);
  });

  it('sends the appropriate prop to FilterList when changing sides', () => {
    const component = shallow(<App />);
    const instance = component.instance();
    instance.setFactions(['foo'], 'runner');
    instance.setFactions(['bar'], 'corp');
    instance.setSide('runner');

    expect(component.find(FilterList).prop('selected')).toEqual(["foo"]);

    instance.setSide('corp');

    expect(component.find(FilterList).prop('selected')).toEqual(["bar"]);

  });

  it('retains selected filter when changing sides and faction selection', () => {
    const component = shallow(<App />);
    const instance = component.instance();
    instance.setFactions([], 'runner');
    instance.setFactions(['bar'], 'corp');
    instance.setSide('runner');
    component.find(FilterList).prop('onChange')(["foo"]);
    instance.setSide('corp');

    expect(component.find(FilterList).prop('selected')).toEqual(["bar"]);

  });

  it('sends the appropriate prop to CardList when selected', () => {
    const component = shallow(<App />);
    component.find(FilterList).prop('onChange')(["foo"]);

    expect(component.find(CardList).prop('factions')).toEqual(["foo"]);
  });
});

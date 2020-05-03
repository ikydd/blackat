import React from 'react';
import ReactDOM from 'react-dom';
import { create }  from 'react-test-renderer';
import { shallow } from 'enzyme';
import App from './App';
import ControlPanel from './components/ControlPanel';
import CardList from './components/CardList';

jest.mock('./components/ControlPanel');
jest.mock('./components/CardList');

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('contains the ControlPanel', () => {
  const component = create(<App />);
  expect(component.root.findAllByType(ControlPanel).length).toEqual(1);
});

it('contains the CardList', () => {
  const component = create(<App />);
  expect(component.root.findAllByType(CardList).length).toEqual(1);
});

describe('Side Selection', () => {
  it('starts on the runner side', () => {
    const component = shallow(<App />);
    expect(component.state('side')).toEqual("runner");
  });

  it('pass a side selection callback to the ControlPanel', () => {
    const component = create(<App />);
    expect(component.root.findByType(ControlPanel).props.onSideSelect).toEqual(expect.any(Function));
  });

  it('sends the appropriate prop to CardList when selected', () => {
    const component = create(<App />);
    component.root.findByType(ControlPanel).props.onSideSelect("foo");
    expect(component.root.findByType(CardList).props.side).toEqual("foo");
  });
});

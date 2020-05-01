import React from 'react';
import ReactDOM from 'react-dom';
import { create }  from 'react-test-renderer';
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

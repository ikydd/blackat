import React from 'react';
import { shallow } from 'enzyme';
import ControlPanel from './ControlPanel';
import Header from './Header';

jest.mock('../helpers/api');
jest.mock('./SideButton');
jest.mock('./FilterList');

describe('CardList', () => {
  it('renders without crashing', () => {
    shallow(<ControlPanel/>);
  });

  it('has a header', () => {
    const component = shallow(<ControlPanel/>);

    expect(component.find(Header).length).toEqual(1);
  });

  it('renders child elements', () => {
    const component = shallow(<ControlPanel><span /></ControlPanel>);

    expect(component.find('span').length).toEqual(1);
  });
});

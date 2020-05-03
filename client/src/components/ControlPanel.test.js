import React from 'react';
import { create }  from 'react-test-renderer';
import { shallow } from 'enzyme';
import ControlPanel from './ControlPanel';
import Header from './Header';
import SideButton from './SideButton';

jest.mock('../helpers/api');
jest.mock('./SideButton');

describe('CardList', () => {
  it('renders without crashing', () => {
    shallow(<ControlPanel/>);
  });

  it('has a header', () => {
    const component = create(<ControlPanel/>);
    expect(component.root.findAllByType(Header).length).toEqual(1);
  });

  it('has two sides', () => {
    const component = create(<ControlPanel/>);
    expect(component.root.findAllByType(SideButton).length).toEqual(2);
  });

  it('has Runner as the first side', () => {
    const component = create(<ControlPanel/>);
    expect(component.root.findAllByType(SideButton)[0].props.title).toEqual('Runner');
  });

  it('has Corp as the second side', () => {
    const component = create(<ControlPanel/>);
    expect(component.root.findAllByType(SideButton)[1].props.title).toEqual('Corp');
  });
});

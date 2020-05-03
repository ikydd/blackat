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

  describe('Sides', () => {
    it('has two sides', () => {
      const component = create(<ControlPanel/>);
      expect(component.root.findAllByType(SideButton).length).toEqual(2);
    });

    it('has Runner as the first side', () => {
      const component = create(<ControlPanel/>);
      expect(component.root.findAllByType(SideButton)[0].props.title).toEqual('Runner');
      expect(component.root.findAllByType(SideButton)[0].props.side).toEqual('runner');
    });

    it('has Corp as the second side', () => {
      const component = create(<ControlPanel/>);
      expect(component.root.findAllByType(SideButton)[1].props.title).toEqual('Corp');
      expect(component.root.findAllByType(SideButton)[1].props.side).toEqual('corp');
    });

    it('passes a callback trhough to the SideButtons', () => {
      const cb = jest.fn();
      const component = create(<ControlPanel onSideSelect={cb}/>);
      expect(component.root.findAllByType(SideButton)[0].props.onSelect).toEqual(cb);
      expect(component.root.findAllByType(SideButton)[1].props.onSelect).toEqual(cb);
    });

    it('changes props on the SideButtons as a result of a prop passed through', () => {
      const component = create(<ControlPanel side="runner"/>);
      expect(component.root.findAllByType(SideButton)[0].props.selected).toEqual(true);
      expect(component.root.findAllByType(SideButton)[1].props.selected).toEqual(false);
    });
  });
});

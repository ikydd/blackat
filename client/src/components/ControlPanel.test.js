import React from 'react';
import { create }  from 'react-test-renderer';
import { shallow } from 'enzyme';
import ControlPanel from './ControlPanel';
import Header from './Header';
import SideButton from './SideButton';
import FilterList from './FilterList';

jest.mock('../helpers/api');
jest.mock('./SideButton');
jest.mock('./FilterList');

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

    it('passes a callback through to the SideButtons', () => {
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

  describe('Filters', () => {
    it('has a factions filter', () => {
      const component = create(<ControlPanel side="runner"/>);
      expect(component.root.findAllByType(FilterList).length).toEqual(1);
    });

    it('passes the side to the faction filter', () => {
      const component = create(<ControlPanel side="runner"/>);
      expect(component.root.findAllByType(FilterList)[0].props.side).toEqual('runner');
    });

    it('passes a callback to the faction filter', () => {
      const cb = jest.fn();
      const component = create(<ControlPanel side="runner" onFactionChange={cb}/>);
      expect(component.root.findAllByType(FilterList)[0].props.onChange).toEqual(cb);
    });
  });
});

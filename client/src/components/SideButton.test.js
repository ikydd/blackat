import React from 'react';
import { shallow } from 'enzyme';
import SideButton from './SideButton';

jest.mock('../helpers/api');

describe('CardList', () => {
  it('renders without crashing', () => {
    shallow(<SideButton/>);
  });

  it('uses the name passed in', () => {
    const title = 'Foo';
    const component = shallow(<SideButton title={title} />);
    expect(component.text()).toEqual(title);
  })

  it('has the class side-button', () => {
    const title = 'Foo';
    const component = shallow(<SideButton title={title} />);
    expect(component.hasClass('side-button')).toEqual(true);
  });

  it('displays as selected depending on props', () => {
    const title = 'Foo';
    const isSelected = true;
    const component = shallow(<SideButton title={title} selected={isSelected} />);
    expect(component.hasClass('selected')).toEqual(true);
  });

  it('calls a callback when clicked on and not selected', () => {
    const title = 'Foo';
    const side = 'foo';
    const isSelected = false;
    const cb = jest.fn();
    const component = shallow(<SideButton title={title} side={side} selected={isSelected} onSelect={cb} />);
    component.simulate('click');
    expect(cb).toHaveBeenCalledWith(side);
  })

  it('does not call a callback when clicked on and already selected', () => {
    const title = 'Foo';
    const side = 'foo';
    const isSelected = true;
    const cb = jest.fn();
    const component = shallow(<SideButton title={title} side={side} selected={isSelected} onSelect={cb} />);
    component.simulate('click');
    expect(cb).not.toHaveBeenCalled();
  })
});

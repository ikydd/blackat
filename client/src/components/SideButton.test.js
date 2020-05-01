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
});

import React from 'react';
import { shallow } from 'enzyme';
import SideButton from './SideButton';

jest.mock('../helpers/api');

describe('CardList', () => {
  it('renders without crashing', () => {
    shallow(<SideButton/>);
  });

  it('uses the name passed in', () => {
    const name = 'Foo';
    const component = shallow(<SideButton name={name} />);
    expect(component.text()).toEqual(name);
  })

  it('has the class side-button', () => {
    const name = 'Foo';
    const card = shallow(<SideButton name={name} />);
    expect(card.hasClass('button-side')).toEqual(true);
  });
});

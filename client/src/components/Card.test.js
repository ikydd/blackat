import React from 'react';
import Card from './Card';
import { shallow } from 'enzyme'

describe('Card', () => {
  const data = require('../../../fixtures/cards')[0];

  it('renders without crashing', () => {
    shallow(<Card data={data}/>);
  });

  it('has an img using the src', () => {
    const card = shallow(<Card data={data} />);
    expect(card.find('img').prop('src')).toEqual(data.imagesrc);
  });

  it('has a title', () => {
    const card = shallow(<Card data={data} />);
    expect(card.prop('title')).toEqual(data.title);
  });

  it('has the class card-tile', () => {
    const card = shallow(<Card data={data} />);
    expect(card.hasClass('card-tile')).toEqual('card-tile');
  });
});

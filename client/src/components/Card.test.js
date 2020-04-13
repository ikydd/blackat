import React from 'react';
import Card from './Card';
import { shallow } from 'enzyme'

describe('Card', () => {
  const data = {
    name: 'A card',
    imagesrc: 'http://test.com/test.png'
  }

  it('renders without crashing', () => {
    shallow(<Card data={data}/>);
  });

  it('has an img', () => {
    const card = shallow(<Card data={data} />);
    expect(card.find('img').prop('src')).toEqual(data.imagesrc);
  });
  
  it('has a title', () => {
    const card = shallow(<Card data={data} />);
    expect(card.prop('title')).toEqual(data.name);
  });
});
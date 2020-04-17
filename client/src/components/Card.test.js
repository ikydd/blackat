import React from 'react';
import Card from './Card';
import { shallow } from 'enzyme'

describe('Card', () => {
  const data = {
    name: 'A card',
    code: '12345'
  }

  it('renders without crashing', () => {
    shallow(<Card data={data}/>);
  });

  it('has an img', () => {
    const card = shallow(<Card data={data} />);
    expect(card.find('img').prop('src')).toEqual(`https://netrunnerdb.com/card_image/${data.code}.png`);
  });

  it('has a title', () => {
    const card = shallow(<Card data={data} />);
    expect(card.prop('title')).toEqual(data.name);
  });
});

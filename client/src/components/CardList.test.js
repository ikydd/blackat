import React from 'react';
import { create}  from 'react-test-renderer';
import { mount } from 'enzyme'
import CardList from './CardList';
import Card from './Card';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('CardList', () => {

  let mockData = [
    {
      name: 'foo1',
      imagesrc: 'http://test.com/test1.png'
    },
    {
      name: 'foo2',
      imagesrc: 'http://test.com/test2.png'
    },
    {
      name: 'foo3',
      imagesrc: 'http://test.com/test3.png'
    }
  ];

  beforeEach(() => {
    jest.spyOn(api, 'call').mockImplementation(() => Promise.resolve(mockData));
  });

  it('renders without crashing', () => {
    mount(<CardList/>);
  });

  it('uses api.call correctly', () => {
    mount(<CardList/>);

    expect(api.call).toHaveBeenCalledWith('/cards');
  });

  it('renders with multiple cards', () => {
    const component = create(<CardList/>);
    component.root.findAllByType(Card)
  })
});
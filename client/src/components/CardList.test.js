import React from 'react';
import { create, act  }  from 'react-test-renderer';
import waitUntil from 'async-wait-until';
import { shallow, mount } from 'enzyme'
import CardList from './CardList';
import Card from './Card';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('CardList', () => {

  let mockData = [
    {
      name: 'foo1',
      imagesrc: '/test1.png'
    },
    {
      name: 'foo2',
      imagesrc: '/test2.png'
    },
    {
      name: 'foo3',
      imagesrc: '/test3.png'
    }
  ];

  beforeEach(() => {
    jest.spyOn(api, 'call').mockImplementation(() => Promise.resolve(mockData));
  });

  it('renders without crashing', () => {
    shallow(<CardList/>);
  });

  it('uses api.call correctly', () => {
    shallow(<CardList/>);

    expect(api.call).toHaveBeenCalledWith('/cards');
  });

  it('renders with no cards to begin with', async () => {
    let component;
    act(() => {
      component = create(<CardList/>);
    });

    expect(component.findAllByType(Card).length).toEqual(0);
  })

  it('renders with multiple cards', async () => {
    let component;
    act(() => {
      component = create(<CardList/>);
    });

    expect(component.findAllByType(Card).length).toEqual(3);
  })
});

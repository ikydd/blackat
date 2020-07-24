import React from 'react';
import { waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import CardList from './CardList';
import Card from './Card';
import * as api from '../helpers/api';

jest.mock('../helpers/api');
jest.mock('./Card', () => 'Card');

describe('CardList', () => {
  const mockData = require('../../../fixtures/api/cards');

  beforeEach(() => {
    jest.spyOn(api, 'call').mockImplementation(() => Promise.resolve(mockData));
  });

  it('renders without crashing', () => {
    shallow(<CardList/>);
  });

  it('renders with no cards to begin with', async () => {
    const component = shallow(<CardList/>);

    expect(component.find(Card).length).toEqual(0);
  })

  it('uses api.call correctly', () => {
    shallow(<CardList/>);

    expect(api.call).toHaveBeenCalledWith('/cards');
  });

  it('default to showing all cards', async () => {
    const component = shallow(<CardList/>);

    await waitFor(() => component.find(Card).length > 0)

    expect(component.find(Card).length).toEqual(5);
  });

  it('only shows cards from the correct side', async () => {
    const component = shallow(<CardList side="runner" />);

    await waitFor(() => component.find(Card).length > 0)

    expect(component.find(Card).length).toEqual(2);
  });

  it('only shows cards from the correct factions', async () => {
    const factions = ['shaper'];
    const component = shallow(<CardList factions={factions} />);

    await waitFor(() => component.find(Card).length > 0)

    expect(component.find(Card).length).toEqual(1);
  });

  it('only shows cards from the correct types', async () => {
    const types = ['program'];
    const component = shallow(<CardList types={types} />);

    await waitFor(() => component.find(Card).length > 0)

    expect(component.find(Card).length).toEqual(2);
  });

  it('only shows cards from the correct packs', async () => {
    const packs = ['wla'];
    const component = shallow(<CardList packs={packs} />);

    await waitFor(() => component.find(Card).length > 0)

    expect(component.find(Card).length).toEqual(1);
  });
});

import React from 'react';
import { create }  from 'react-test-renderer';
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
    const component = create(<CardList/>);

    expect(component.root.findAllByType(Card).length).toEqual(0);
  })

  it('uses api.call correctly', () => {
    shallow(<CardList/>);

    expect(api.call).toHaveBeenCalledWith('/cards');
  });

  it('default to showing all cards', async () => {
    const component = create(<CardList/>);

    await waitFor(() => component.root.findAllByType(Card).length > 0)

    expect(component.root.findAllByType(Card).length).toEqual(5);
  });

  it('only shows cards from the correct side', async () => {
    const component = create(<CardList side="runner" />);

    await waitFor(() => component.root.findAllByType(Card).length > 0)

    expect(component.root.findAllByType(Card).length).toEqual(2);
  });

  it('only shows cards from the correct factions', async () => {
    const factions = ['shaper'];
    const component = create(<CardList factions={factions} />);

    await waitFor(() => component.root.findAllByType(Card).length > 0)

    expect(component.root.findAllByType(Card).length).toEqual(1);
  });
});

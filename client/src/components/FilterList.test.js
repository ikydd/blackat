import React from 'react';
import { create }  from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import FilterList from './FilterList';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('FilterList', () => {
  const mockData = require('../../../fixtures/api/factions');

  beforeEach(() => {
    jest.spyOn(api, 'call').mockImplementation(() => Promise.resolve(mockData));
  });

  it('renders without crashing', () => {
    shallow(<FilterList/>);
  });

  it('renders with no options to begin with', async () => {
    const component = create(<FilterList/>);

    expect(component.root.findAllByType('input').length).toEqual(0);
  })

  it('uses api.call correctly', () => {
    shallow(<FilterList/>);

    expect(api.call).toHaveBeenCalledWith('/factions');
  });

  it('default to showing all options', async () => {
    const component = create(<FilterList/>);

    await waitFor(() => component.root.findAllByType('input').length > 0);

    expect(component.root.findAllByType('input').length).toEqual(5);
  });

  it('only shows options from the correct side', async () => {
    const component = create(<FilterList side="corp" />);

    await waitFor(() => component.root.findAllByType('input').length > 0);

    expect(component.root.findAllByType('input').length).toEqual(2);
  });
});

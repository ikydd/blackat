import React from 'react';
import { waitFor, render, fireEvent } from '@testing-library/react';
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

  it('has a title', () => {
    const component = shallow(<FilterList/>);

    expect(component.find('.filter-list-title').text()).toEqual('Factions');
  });

  it('renders with no options to begin with', async () => {
    const component = shallow(<FilterList/>);

    expect(component.find('input').length).toEqual(0);
  })

  it('uses api.call correctly', () => {
    shallow(<FilterList/>);

    expect(api.call).toHaveBeenCalledWith('/factions');
  });

  it('default to showing all options', async () => {
    const component = shallow(<FilterList/>);

    await waitFor(() => component.find('input').length > 0);

    expect(component.find('input').length).toEqual(5);
  });

  it('only shows options from the correct side', async () => {
    const component = shallow(<FilterList side="corp" />);

    await waitFor(() => component.find('input').length > 0);

    expect(component.find('input').length).toEqual(2);
  });

  it('accepts a list of selected filters', async () => {
    const isSelected = ['shaper', 'anarch'];
    const component = shallow(<FilterList selected={isSelected} />);

    await waitFor(() => component.find('input').length > 0);

    const checked = component.find('input')
      .map((input) => input)
      .filter((input) => input.prop('checked'))
      .map((input) => input.prop('value'));

    expect(checked).toEqual(['anarch', 'shaper']);
  })

  it('calls a callback when an option is selected', async () => {
    const cb = jest.fn();
    const { findByLabelText } = render(<FilterList onChange={cb} />);

    const input = await findByLabelText('Anarch');

    fireEvent.click(input);
    expect(cb).toHaveBeenCalledWith(['anarch']);
  })

  it('calls a callback when an option is deselected', async () => {
    const selected = ['anarch', 'shaper'];
    const cb = jest.fn();
    const { findByLabelText } = render(<FilterList selected={selected} onChange={cb} />);

    const input = await findByLabelText('Anarch');

    fireEvent.click(input);
    expect(cb).toHaveBeenCalledWith(['shaper']);
  })
});

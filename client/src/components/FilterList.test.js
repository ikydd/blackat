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
    shallow(<FilterList endpoint="foo"/>);
  });

  it('has defaults to an obvious error title', () => {
    const component = shallow(<FilterList endpoint="foo"/>);

    expect(component.find('.filter-list-title').text()).toEqual('Missing');
  });

  it('has accepts and uses a title', () => {
    const component = shallow(<FilterList endpoint="foo" title="Foo" />);

    expect(component.find('.filter-list-title').text()).toEqual('Foo');
  });

  it('has an id related to the title', () => {
    const component = shallow(<FilterList endpoint="foo" title="Foo" />);

    expect(component.prop('id')).toEqual('foo-filter');
  });

  it('renders with no options to begin with', async () => {
    const component = shallow(<FilterList endpoint="foo" />);

    expect(component.find('input').length).toEqual(0);
  })

  it('throws and error if no endpoint prop is provided', () => {
    expect(() => shallow(<FilterList/>)).toThrow();
  });

  it('uses api.call correctly with the provided prop', () => {
    shallow(<FilterList endpoint="foo"/>);

    expect(api.call).toHaveBeenCalledWith('/foo');
  });

  it('default to showing all options', async () => {
    const component = shallow(<FilterList endpoint="foo" />);

    await waitFor(() => component.find('input').length > 0);

    expect(component.find('input').length).toEqual(5);
  });

  it('only shows options from the correct side', async () => {
    const component = shallow(<FilterList endpoint="foo" side="corp" />);

    await waitFor(() => component.find('input').length > 0);

    expect(component.find('input').length).toEqual(2);
  });

  it('accepts a list of selected filters', async () => {
    const isSelected = ['shaper', 'anarch'];
    const component = shallow(<FilterList endpoint="foo" selected={isSelected} />);

    await waitFor(() => component.find('input').length > 0);

    const checked = component.find('input')
      .map((input) => input)
      .filter((input) => input.prop('checked'))
      .map((input) => input.prop('value'));

    expect(checked).toEqual(['anarch', 'shaper']);
  })

  it('calls a callback when an option is selected', async () => {
    const cb = jest.fn();
    const { findByLabelText } = render(<FilterList endpoint="foo" onChange={cb} />);

    const input = await findByLabelText('Anarch');

    fireEvent.click(input);
    expect(cb).toHaveBeenCalledWith(['anarch']);
  })

  it('calls a callback when an option is deselected', async () => {
    const selected = ['anarch', 'shaper'];
    const cb = jest.fn();
    const { findByLabelText } = render(<FilterList endpoint="foo" selected={selected} onChange={cb} />);

    const input = await findByLabelText('Anarch');

    fireEvent.click(input);
    expect(cb).toHaveBeenCalledWith(['shaper']);
  })
});

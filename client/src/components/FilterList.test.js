import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterList from './FilterList';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('FilterList', () => {
  const mockData = require('../../../fixtures/api/filter-items');

  beforeEach(() => {
    jest.spyOn(api, 'getData').mockImplementation(() => Promise.resolve(mockData));
  });

  it('renders without crashing', () => {
    render(<FilterList dataType="foo"/>);
  });

  it('has defaults to an obvious error title', () => {
    const { getByRole } = render(<FilterList dataType="foo"/>);

    expect(getByRole('heading')).toHaveTextContent('Missing');
  });

  it('has accepts and uses a title', () => {
    const { getByRole } = render(<FilterList dataType="foo" title="Foo" />);

    expect(getByRole('heading')).toHaveTextContent('Foo');
  });

  it('renders with no options to begin with', () => {
    const { queryAllByRole } = render(<FilterList dataType="foo" />);
    const checkboxes = queryAllByRole('checkbox');

    expect(checkboxes).toHaveLength(0);
  })

  it('throws and error if no dataType prop is provided x', () => {
    const err = console.error;
    console.error = jest.fn();

    expect(() => render(<FilterList/>)).toThrow();
    console.error = err;
  });

  it('uses api.getData correctly with the provided prop', () => {
    render(<FilterList dataType="foo"/>);

    expect(api.getData).toHaveBeenCalledWith('foo');
  });

  it('default to showing all options', async () => {
    const { findAllByRole } = render(<FilterList dataType="foo" />);
    const checkboxes = await findAllByRole('checkbox');

    expect(checkboxes).toHaveLength(6);
  });

  it('only shows options from corp and those that have no specified side', async () => {
    const { findAllByRole } = render(<FilterList dataType="foo" side="corp" />);
    const checkboxes = await findAllByRole('checkbox');

    expect(checkboxes).toHaveLength(3);
  });

  it('only shows options from runner and those that have no specified side', async () => {
    const { findAllByRole } = render(<FilterList dataType="foo" side="runner" />);
    const checkboxes = await findAllByRole('checkbox');

    expect(checkboxes).toHaveLength(4);
  });

  it('accepts a list of selected filters', async () => {
    const isSelected = ['shaper', 'anarch'];
    const { findAllByRole } = render(<FilterList dataType="foo" selected={isSelected} />);
    const checkboxes = await findAllByRole('checkbox');

    const checked = checkboxes
      .filter(({ checked }) => checked)
      .map((input) => input.getAttribute('value'));

    expect(checked).toEqual(['anarch', 'shaper']);
  })

  it('calls a callback when an option is selected', async () => {
    const cb = jest.fn();
    const { findByLabelText } = render(<FilterList dataType="foo" onChange={cb} />);

    const input = await findByLabelText('Anarch');

    fireEvent.click(input);
    expect(cb).toHaveBeenCalledWith(['anarch']);
  })

  it('calls a callback when an option is deselected', async () => {
    const selected = ['anarch', 'shaper'];
    const cb = jest.fn();
    const { findByLabelText } = render(<FilterList dataType="foo" selected={selected} onChange={cb} />);

    const input = await findByLabelText('Anarch');

    fireEvent.click(input);
    expect(cb).toHaveBeenCalledWith(['shaper']);
  })
});

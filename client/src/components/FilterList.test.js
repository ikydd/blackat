import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterList from './FilterList';
import * as api from '../helpers/api';

jest.mock('../helpers/api');

describe('FilterList', () => {

  beforeEach(() => {
    api.setData('foo', require('../../../fixtures/api/foo'));
  });

  afterEach(() => {
    api.reset();
  });

  it('renders without crashing', () => {
    render(<FilterList dataType="foo"/>);
  });

  it('has defaults to an obvious error title', () => {
    const { getByRole } = render(<FilterList dataType="foo"/>);

    expect(getByRole('heading')).toHaveTextContent('Missing');
  });

  it('accepts and uses a title', () => {
    const { getByRole } = render(<FilterList dataType="foo" title="Foo" />);

    expect(getByRole('heading')).toHaveTextContent('Foo');
  });

  describe('Data hydration', () => {
    it('renders with no options to begin with', () => {
      const { queryAllByRole } = render(<FilterList dataType="foo" />);
      const checkboxes = queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    })

    it('throws an error if no dataType prop is provided', () => {
      const err = console.error;
      console.error = jest.fn();

      expect(() => render(<FilterList/>)).toThrow();
      console.error = err;
    });
  });

  describe('options', () => {
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
  });

  describe('nested options', () => {

    beforeEach(() => {
      api.setData('foo', require('../../../fixtures/api/foo-nested'));
    });

    it('default to showing all top-level options and sub-options where there is more than one', async () => {
      const { findAllByRole } = render(<FilterList dataType="foo" />);
      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(5);
    });

    it('calls the callback when the group is checked', async () => {
      const cb = jest.fn();
      const { findByLabelText } = render(<FilterList dataType="foo" onGroupChange={cb} />);
      const group = await findByLabelText('Bar');
      fireEvent.click(group);

      expect(cb).toHaveBeenCalledWith([
        expect.objectContaining({ code: 'alpha' }),
        expect.objectContaining({ code: 'beta' }),
        expect.objectContaining({ code: 'gamma' })
      ], true);
    });

    it('calls the callback when the group is unchecked', async () => {
      const isSelected = ['alpha', 'beta', 'gamma'];
      const cb = jest.fn();
      const { findByLabelText } = render(<FilterList dataType="foo" selected={isSelected} onGroupChange={cb} />);
      const group = await findByLabelText('Bar');
      fireEvent.click(group);

      expect(cb).toHaveBeenCalledWith([
        expect.objectContaining({ code: 'alpha' }),
        expect.objectContaining({ code: 'beta' }),
        expect.objectContaining({ code: 'gamma' })
      ], false);
    });

    it('checks the sub-items when provided as selected prop', async () => {
      const isSelected = ['alpha', 'gamma'];
      const { findAllByRole } = render(<FilterList dataType="foo" selected={isSelected} />);
      const checkboxes = await findAllByRole('checkbox');

      const checked = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(checked).toEqual(['alpha', 'gamma']);
    })

    it('does not check the group if not all sub-items are provided as selected prop', async () => {
      const isSelected = ['alpha', 'beta'];
      const { findByLabelText } = render(<FilterList dataType="foo" selected={isSelected} />);
      const bar = await findByLabelText('Bar');

      expect(bar).not.toBeChecked();
    });

    it('checks the group if all sub-items are provided as selected prop', async () => {
      const isSelected = ['alpha', 'beta', 'gamma'];
      const { findByLabelText } = render(<FilterList dataType="foo" selected={isSelected} />);
      const bar = await findByLabelText('Bar');

      expect(bar).toBeChecked();
    });
  });

  describe('visibility toggle', () => {
    it('shows options by default', async () => {
      const { findAllByRole } = render(<FilterList dataType="foo" side="runner" />);
      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(4);
    });

    it('can be configured to hide filters via a prop', async () => {
      const { queryAllByRole } = render(<FilterList dataType="foo" side="runner" hidden={true} />);
      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('toggles options when heading is clicked', async () => {
      const { findAllByRole, getByRole } = render(<FilterList dataType="foo" side="runner" hidden={true} />);
      fireEvent.click(getByRole('heading'));

      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(4);
    });

    it('toggles options again when heading is clicked a second time', async () => {
      const { queryAllByRole, getByRole } = render(<FilterList dataType="foo" side="runner" hidden={true} />);
      fireEvent.click(getByRole('heading'));
      fireEvent.click(getByRole('heading'));

      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });
  });

  describe('clear all button', () => {
    it('removes all selected filters', async () => {
      const isSelected = ['shaper', 'anarch'];
      const cb = jest.fn();
      const { getByRole } = render(<FilterList dataType="foo" selected={isSelected} clearAll={cb} />);
      fireEvent.click(getByRole('button'))

      expect(cb).toHaveBeenCalled();
    })
  });

  describe('active notifier', () => {
    it('has no visual mark when no filters are selected', async () => {
      const { queryByRole, findAllByRole } = render(<FilterList dataType="foo" />);
      await findAllByRole('checkbox');

      const alert = queryByRole('alert');

      expect(alert).toBeFalsy();
    });
    it('has a visual mark when one or more filters are selected', async () => {
      const isSelected = ['shaper', 'anarch'];
      const { findByRole } = render(<FilterList dataType="foo" selected={isSelected} />);
      const alert = await findByRole('alert');

      expect(alert).toBeTruthy();
    });
  })
});

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

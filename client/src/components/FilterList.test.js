import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterList from './FilterList';

const options = require('../../../fixtures/api/foo');
const optionsSelected = require('../../../fixtures/api/foo-selected');

describe('FilterList', () => {
  it('renders without crashing', () => {
    render(<FilterList options={options} />);
  });

  it('has defaults to an obvious error title', () => {
    const { getByRole } = render(<FilterList options={options} />);

    expect(getByRole('heading')).toHaveTextContent('Missing');
  });

  it('accepts and uses a title', () => {
    const { getByRole } = render(<FilterList options={options} title="Foo" />);

    expect(getByRole('heading')).toHaveTextContent('Foo');
  });

  describe('options', () => {
    it('default to showing all options', async () => {
      const { findAllByRole } = render(<FilterList options={options} />);
      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('shows filters as selected', async () => {
      const { findAllByRole } = render(<FilterList options={optionsSelected} />);
      const checkboxes = await findAllByRole('checkbox');

      const checked = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(checked).toEqual(['anarch', 'shaper']);
    })
  });

  describe('nested options', () => {
    const optionsNested = require('../../../fixtures/api/foo-nested');

    it('default to showing all top-level options and sub-options where there is more than one', async () => {
      const cb = jest.fn();
      const groupCb = jest.fn();
      const { findAllByRole } = render(<FilterList options={optionsNested} onChange={cb} onGroupChange={groupCb}  />);
      const checkboxes = await findAllByRole('checkbox');

      const expected = optionsNested.reduce((total, group) => (group.items.length > 1 ? total + group.items.length : total) + 1, 0);

      expect(checkboxes).toHaveLength(expected);
    });

    it('calls the callback when the group is checked', async () => {
      const cb = jest.fn();
      const groupCb = jest.fn();
      const { findByLabelText } = render(<FilterList options={optionsNested} onChange={cb} onGroupChange={groupCb} />);
      const group = await findByLabelText('Bar');
      fireEvent.click(group);

      expect(groupCb).toHaveBeenCalled();
    });

    it('calls the callback when the group is unchecked', async () => {
      const cb = jest.fn();
      const groupCb = jest.fn();
      const optionsNestedSelected = require('../../../fixtures/api/foo-nested-selected');
      const { findByLabelText } = render(<FilterList options={optionsNestedSelected} onChange={cb} onGroupChange={groupCb} />);
      const group = await findByLabelText('Bar');
      fireEvent.click(group);

      expect(groupCb).toHaveBeenCalled();
    });

    it('calls the callback when an item is checked', async () => {
      const cb = jest.fn();
      const groupCb = jest.fn();
      const { findByLabelText } = render(<FilterList options={optionsNested} onChange={cb} onGroupChange={groupCb} />);
      const group = await findByLabelText('Alpha');
      fireEvent.click(group);

      expect(cb).toHaveBeenCalled();
    });
  });

  describe('visibility toggle', () => {
    it('shows options by default', async () => {
      const { findAllByRole } = render(<FilterList options={options} />);
      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('can be configured to hide filters via a prop', async () => {
      const { queryAllByRole } = render(<FilterList options={options} hidden={true} />);
      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('toggles options when heading is clicked', async () => {
      const { findAllByRole, getByRole } = render(<FilterList options={options} hidden={true} />);
      fireEvent.click(getByRole('heading'));

      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('toggles options again when heading is clicked a second time', async () => {
      const { queryAllByRole, getByRole } = render(<FilterList options={options} hidden={true} />);
      fireEvent.click(getByRole('heading'));
      fireEvent.click(getByRole('heading'));

      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });
  });

  describe('clear all button', () => {
    it('removes all selected filters', async () => {
      const cb = jest.fn();
      const { getByRole } = render(<FilterList options={options} clearAll={cb} />);
      fireEvent.click(getByRole('button'))

      expect(cb).toHaveBeenCalled();
    })
  });

  describe('active notifier', () => {
    it('has no visual mark when no filters are selected', async () => {
      const { queryByRole, findAllByRole } = render(<FilterList options={options} />);
      await findAllByRole('checkbox');

      const alert = queryByRole('alert');

      expect(alert).toBeFalsy();
    });

    it('has a visual mark when one or more filters are selected', async () => {
      const { findByRole } = render(<FilterList options={optionsSelected} />);
      const alert = await findByRole('alert');

      expect(alert).toBeTruthy();
    });
  })
});

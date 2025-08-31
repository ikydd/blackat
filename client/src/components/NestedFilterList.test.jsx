import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NestedFilterList from './NestedFilterList';

import options from '../../../fixtures/api/foo-nested.json';
import singleOptions from '../../../fixtures/api/foo-nested-single.json';
import groupOptions from '../../../fixtures/api/foo-nested-group.json';

const countCheckboxes = (checkboxes) =>
  checkboxes.reduce(
    (total, group) => (group.items.length > 1 ? total + group.items.length : total) + 1,
    0
  );

describe('NestedFilterList', () => {
  it('renders without crashing', () => {
    expect(() => render(<NestedFilterList options={options} />)).not.toThrow();
  });

  it('has defaults to an obvious error title', () => {
    const { getByText } = render(<NestedFilterList options={options} />);

    expect(getByText('Missing')).toBeTruthy();
  });

  it('accepts and uses a title', () => {
    const { getByText } = render(<NestedFilterList title="A Title" options={options} />);

    expect(getByText('A Title')).toBeTruthy();
  });

  describe('Options', () => {
    it('shows provided grouped options with grouping', async () => {
      const { findAllByRole } = render(<NestedFilterList options={groupOptions} />);
      const checkboxes = await findAllByRole('checkbox');

      const expected = countCheckboxes(groupOptions);

      expect(checkboxes).toHaveLength(expected);
    });

    it('does not show subitems for groups with only one item', async () => {
      const { findAllByRole } = render(<NestedFilterList options={singleOptions} />);
      const checkboxes = await findAllByRole('checkbox');

      const expected = countCheckboxes(singleOptions);

      expect(checkboxes).toHaveLength(expected);
    });

    it('shows correct filters as selected', async () => {
      const { findAllByRole } = render(
        <NestedFilterList options={options} settings={['alpha', 'beta', 'gamma']} />
      );
      const checkboxes = await findAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(selected).toEqual(['bar', 'alpha', 'beta', 'gamma']);
    });

    it('calls the callback when the group is checked', async () => {
      const groupCb = jest.fn();
      const { findByLabelText } = render(<NestedFilterList options={options} onChange={groupCb} />);
      const group = await findByLabelText('Bar');
      fireEvent.click(group);

      expect(groupCb).toHaveBeenCalled();
    });

    it('calls the callback when the group is unchecked', async () => {
      const groupCb = jest.fn();
      const { findByLabelText } = render(
        <NestedFilterList
          options={options}
          settings={['alpha', 'beta', 'gamma']}
          onChange={groupCb}
        />
      );
      const group = await findByLabelText('Bar');
      fireEvent.click(group);

      expect(groupCb).toHaveBeenCalled();
    });

    it('calls the callback when an item is checked', async () => {
      const cb = jest.fn();
      const { findByLabelText } = render(<NestedFilterList options={options} onChange={cb} />);
      const group = await findByLabelText('Alpha');
      fireEvent.click(group);

      expect(cb).toHaveBeenCalled();
    });
  });

  describe('visibility toggle', () => {
    it('shows options by default', async () => {
      const { findAllByRole } = render(<NestedFilterList options={options} />);
      const checkboxes = await findAllByRole('checkbox');

      const expectedLength = countCheckboxes(options);

      expect(checkboxes).toHaveLength(expectedLength);
    });

    it('can be configured to hide filters via a prop', async () => {
      const { queryAllByRole } = render(<NestedFilterList options={options} closed={true} />);
      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('shows options when closed and heading is clicked', async () => {
      const { findAllByRole, getByText } = render(
        <NestedFilterList title="A Title" options={options} closed={true} />
      );
      fireEvent.click(getByText('A Title'));
      const checkboxes = await findAllByRole('checkbox');

      const expectedLength = countCheckboxes(options);

      expect(checkboxes).toHaveLength(expectedLength);
    });

    it('hides options when showing and heading is clicked', async () => {
      const { queryAllByRole, getByText } = render(
        <NestedFilterList title="A Title" options={options} />
      );
      fireEvent.click(getByText('A Title'));
      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('retains selections when collapsed', async () => {
      const { queryAllByRole, getByText } = render(
        <NestedFilterList title="A Title" options={options} settings={['alpha', 'beta', 'gamma']} />
      );
      const heading = getByText('A Title');
      fireEvent.click(heading);
      fireEvent.click(heading);

      const checkboxes = await queryAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(selected).toEqual(['bar', 'alpha', 'beta', 'gamma']);
    });
  });

  describe('Clear Filters', () => {
    it('has a button', async () => {
      const { getByText } = render(<NestedFilterList options={options} />);

      expect(getByText('Clear Filters')).toBeTruthy();
    });

    it('removes all selected filters', async () => {
      const cb = jest.fn();
      const { getByText } = render(<NestedFilterList options={options} clearAll={cb} />);
      fireEvent.click(getByText('Clear Filters'));

      expect(cb).toHaveBeenCalled();
    });
  });

  describe('active notifier', () => {
    it('has no visual mark when no filters are selected', async () => {
      const { queryByRole, findAllByRole } = render(<NestedFilterList options={options} />);
      await findAllByRole('checkbox');

      const alert = queryByRole('alert');

      expect(alert).toBeFalsy();
    });

    it('has a visual mark when one or more filters are selected', async () => {
      const { findByRole } = render(
        <NestedFilterList options={options} settings={['alpha', 'beta', 'gamma']} />
      );
      const alert = await findByRole('alert');

      expect(alert).toBeTruthy();
    });
  });
});

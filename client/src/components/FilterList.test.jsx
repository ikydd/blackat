import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterList from './FilterList';

import options from '../../../fixtures/api/foo.json';
import optionsSelected from '../../../fixtures/api/foo-selected.json';

describe('FilterList', () => {
  it('renders without crashing', () => {
    expect(() => render(<FilterList options={options} />)).not.toThrow();
  });

  it('has defaults to an obvious error title', () => {
    const { getByText } = render(<FilterList options={options} />);

    expect(getByText('Missing')).toBeTruthy();
  });

  it('accepts and uses a title', () => {
    const { getByText } = render(<FilterList options={options} title="A Title" />);

    expect(getByText('A Title')).toBeTruthy();
  });

  describe('Options', () => {
    it('shows provided options', async () => {
      const { findAllByRole } = render(<FilterList options={options} />);
      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('shows correct filters as selected', async () => {
      const { findAllByRole } = render(<FilterList options={optionsSelected} />);
      const checkboxes = await findAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(selected).toEqual(['anarch', 'shaper']);
    });

    it('calls the callback when an item is checked', async () => {
      const cb = jest.fn();
      const { findByLabelText } = render(<FilterList options={options} onChange={cb} />);
      const group = await findByLabelText('Anarch');
      fireEvent.click(group);

      expect(cb).toHaveBeenCalled();
    });
  });

  describe('Visibility Toggle', () => {
    it('shows options by default', async () => {
      const { findAllByRole } = render(<FilterList options={options} />);
      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('can be configured to hide filters via a prop', async () => {
      const { queryAllByRole } = render(<FilterList options={options} closed={true} />);
      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('shows options when closed and heading is clicked', async () => {
      const { findAllByRole, getByText } = render(
        <FilterList title="A Title" options={options} closed={true} />
      );
      fireEvent.click(getByText('A Title'));

      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('hides options when showing and heading is clicked', async () => {
      const { queryAllByRole, getByText } = render(
        <FilterList title="A Title" options={options} />
      );
      fireEvent.click(getByText('A Title'));

      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('retains selections when collapsed', async () => {
      const { queryAllByRole, getByText } = render(
        <FilterList title="A Title" options={optionsSelected} />
      );
      fireEvent.click(getByText('A Title'));
      fireEvent.click(getByText('A Title'));

      const checkboxes = await queryAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(selected).toEqual(['anarch', 'shaper']);
    });
  });

  describe('Clear All', () => {
    it('has a button', async () => {
      const { getByText } = render(<FilterList options={options} />);

      expect(getByText('Clear All')).toBeTruthy();
    });

    it('removes all selected filters', async () => {
      const cb = jest.fn();
      const { getByText } = render(<FilterList options={options} clearAll={cb} />);
      fireEvent.click(getByText('Clear All'));

      expect(cb).toHaveBeenCalled();
    });
  });

  describe('Active Notifier', () => {
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
  });
});

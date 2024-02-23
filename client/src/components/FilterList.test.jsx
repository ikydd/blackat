import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FilterList from './FilterList';

const options = require('../../../fixtures/api/foo');
const optionsSelected = require('../../../fixtures/api/foo-selected');

describe('FilterList', () => {
  it('renders without crashing', () => {
    expect(() => render(<FilterList options={options} />)).not.toThrow();
  });

  it('has defaults to an obvious error title', () => {
    const { getByRole } = render(<FilterList options={options} />);

    expect(getByRole('heading')).toHaveTextContent('Missing');
  });

  it('accepts and uses a title', () => {
    const { getByRole } = render(<FilterList options={options} title="Foo" />);

    expect(getByRole('heading')).toHaveTextContent('Foo');
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

      const checked = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(checked).toEqual(['anarch', 'shaper']);
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
      const { queryAllByRole } = render(<FilterList options={options} hidden={true} />);
      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('shows options when hidden and heading is clicked', async () => {
      const { findAllByRole, getByRole } = render(<FilterList options={options} hidden={true} />);
      fireEvent.click(getByRole('heading'));

      const checkboxes = await findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('hides options when showing and heading is clicked', async () => {
      const { queryAllByRole, getByRole } = render(<FilterList options={options} />);
      fireEvent.click(getByRole('heading'));

      const checkboxes = await queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('retains selections when collapsed', async () => {
      const { queryAllByRole, getByRole } = render(<FilterList options={optionsSelected} />);
      fireEvent.click(getByRole('heading'));
      fireEvent.click(getByRole('heading'));

      const checkboxes = await queryAllByRole('checkbox');

      const checked = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(checked).toEqual(['anarch', 'shaper']);
    });
  });

  describe('Clear All', () => {
    it('has a button', async () => {
      const { getByRole } = render(<FilterList options={options} />);

      expect(getByRole('button')).toBeTruthy();
    });

    it('removes all selected filters', async () => {
      const cb = jest.fn();
      const { getByRole } = render(<FilterList options={options} clearAll={cb} />);
      fireEvent.click(getByRole('button'));

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

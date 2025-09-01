import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FilterList from './FilterList';

import options from '../../../fixtures/api/foo.json';

describe('FilterList', () => {
  it('renders without crashing', () => {
    expect(() => render(<FilterList options={options} />)).not.toThrow();
  });

  it('has defaults to an obvious error title', () => {
    render(<FilterList options={options} />);

    expect(screen.getByText('Missing')).toBeTruthy();
  });

  it('accepts and uses a title', () => {
    render(<FilterList title="A Title" options={options} />);

    expect(screen.getByText('A Title')).toBeTruthy();
  });

  describe('Options', () => {
    it('shows provided options', async () => {
      render(<FilterList options={options} />);
      const checkboxes = await screen.findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('shows correct filters as selected', async () => {
      render(<FilterList options={options} settings={['anarch', 'shaper']} />);
      const checkboxes = await screen.findAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(selected).toEqual(['anarch', 'shaper']);
    });

    it('calls the callback when an item is checked', async () => {
      const cb = jest.fn();
      render(<FilterList options={options} onChange={cb} />);
      const group = await screen.findByLabelText('Anarch');
      fireEvent.click(group);

      expect(cb).toHaveBeenCalled();
    });
  });

  describe('Visibility Toggle', () => {
    it('shows options by default', async () => {
      render(<FilterList options={options} />);
      const checkboxes = await screen.findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('can be configured to hide filters via a prop', async () => {
      render(<FilterList options={options} closed={true} />);
      const checkboxes = await screen.queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('shows options when closed and heading is clicked', async () => {
      render(<FilterList title="A Title" options={options} closed={true} />);
      fireEvent.click(screen.getByText('A Title'));

      const checkboxes = await screen.findAllByRole('checkbox');

      expect(checkboxes).toHaveLength(options.length);
    });

    it('hides options when showing and heading is clicked', async () => {
      render(<FilterList title="A Title" options={options} />);
      fireEvent.click(screen.getByText('A Title'));

      const checkboxes = await screen.queryAllByRole('checkbox');

      expect(checkboxes).toHaveLength(0);
    });

    it('retains selections when collapsed', async () => {
      render(<FilterList title="A Title" options={options} settings={['anarch', 'shaper']} />);
      const heading = screen.getByText('A Title');
      fireEvent.click(heading);
      fireEvent.click(heading);

      const checkboxes = await screen.queryAllByRole('checkbox');

      const selected = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute('value'));

      expect(selected).toEqual(['anarch', 'shaper']);
    });
  });

  describe('Clear Filters', () => {
    it('has a button', async () => {
      render(<FilterList options={options} />);

      expect(screen.getByText('Clear Filters')).toBeTruthy();
    });

    it('removes all selected filters', async () => {
      const cb = jest.fn();
      render(<FilterList options={options} clearAll={cb} />);
      fireEvent.click(screen.getByText('Clear Filters'));

      expect(cb).toHaveBeenCalled();
    });
  });

  describe('Active Notifier', () => {
    it('has no visual mark when no filters are selected', async () => {
      render(<FilterList options={options} />);
      await screen.findAllByRole('checkbox');

      const alert = screen.queryByRole('alert');

      expect(alert).toBeFalsy();
    });

    it('has a visual mark when one or more filters are selected', async () => {
      render(<FilterList options={options} settings={['anarch', 'shaper']} />);
      const alert = await screen.findByRole('alert');

      expect(alert).toBeTruthy();
    });
  });
});

import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import types from '../../../fixtures/api/types.json';

jest.mock('../helpers/api');

describe('Types filters', () => {
  it('has the correct title', async () => {
    const { getByTestId } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    const heading = within(filterBlock).getByText(/^Types/i);

    await waitFor(() => {
      expect(heading).toBeTruthy();
    });
  });

  it('starts with no checkboxes', async () => {
    const { getByTestId } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    const checkboxes = await within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes).toHaveLength(0);
    });
  });

  it('loads some checkboxes for runner', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    const runnerTypes = types.filter(({ side }) => side === 'runner' || side === null).length;

    expect(checkboxes).toHaveLength(runnerTypes);
  });

  it('starts with empty checkboxes for runner', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('loads some checkboxes for corp', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));
    fireEvent.click(getByText('Corp'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    const corpTypes = types.filter(({ side }) => side === 'corp' || side === null).length;

    expect(checkboxes).toHaveLength(corpTypes);
  });

  it('starts with empty checkboxes for corp', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));
    fireEvent.click(getByText('Corp'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));
    const unchecked = await within(filterBlock).findAllByRole('checkbox');

    fireEvent.click(unchecked[0]);

    const checkboxes = await within(filterBlock).findAllByRole('checkbox');
    const checked = checkboxes.shift();

    expect(checked).toBeChecked();
    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('filters cards correctly', async () => {
    const { getByTestId, findAllByRole, findByRole, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));
    const unchecked = await within(filterBlock).findByLabelText('Hardware');
    const all = await findAllByRole('img');

    expect(all).toHaveLength(4);

    fireEvent.click(unchecked);
    const filtered = await findByRole('img');

    expect(filtered).toHaveAttribute('alt', 'R&D Interface');
  });

  it('retains filters from each side', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));

    let hardware = await within(filterBlock).findByLabelText('Hardware');
    fireEvent.click(hardware);
    fireEvent.click(getByText('Corp'));

    const agenda = await within(filterBlock).findByLabelText('Agenda');
    fireEvent.click(agenda);
    fireEvent.click(getByText('Runner'));

    hardware = await within(filterBlock).findByLabelText('Hardware');

    expect(hardware).toBeChecked();
  });

  it('does not apply filters to the wrong side', async () => {
    const { getByTestId, getByText, findAllByRole } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));

    const hardware = await within(filterBlock).findByLabelText('Hardware');
    fireEvent.click(hardware);
    fireEvent.click(getByText('Corp'));

    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(4);
  });

  it('includes filters appropriate to both sides', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('types-filters');
    fireEvent.click(getByText(/Types/));

    const hardware = await within(filterBlock).findByLabelText('Identity');
    fireEvent.click(hardware);
    fireEvent.click(getByText('Corp'));

    const identity = await within(filterBlock).findByLabelText('Identity');

    expect(identity).toBeChecked();
  });
});

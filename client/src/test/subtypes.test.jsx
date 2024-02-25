import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import subtypes from '../../../fixtures/api/subtypes.json';

jest.mock('../helpers/api');

describe('Subtypes filters', () => {
  it('has the correct title', async () => {
    const { getByTestId } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    const heading = await within(filterBlock).findByRole('heading');

    expect(heading).toHaveTextContent('Subtypes');
  });

  it('starts with no checkboxes', async () => {
    const { getByTestId } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    const checkboxes = within(filterBlock).queryAllByRole('checkbox');

    await waitFor(() => {
      expect(checkboxes).toHaveLength(0);
    });
  });

  it('loads some checkboxes for runner', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    const runnerSubtypes = subtypes.filter(({ side }) => side === 'runner' || side === null).length;

    expect(checkboxes).toHaveLength(runnerSubtypes);
  });

  it('starts with empty checkboxes for runner', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('loads some checkboxes for corp', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));
    fireEvent.click(getByText('Corp'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    const corpSubtypes = subtypes.filter(({ side }) => side === 'corp' || side === null).length;

    expect(checkboxes).toHaveLength(corpSubtypes);
  });

  it('starts with empty checkboxes for corp', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));
    fireEvent.click(getByText('Corp'));
    const checkboxes = await within(filterBlock).findAllByRole('checkbox');

    checkboxes.forEach((box) => {
      expect(box).not.toBeChecked();
    });
  });

  it('selects checkboxes correctly', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));
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
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));
    const unchecked = await within(filterBlock).findByLabelText('Icebreaker');
    const all = await findAllByRole('img');

    expect(all).toHaveLength(3);

    fireEvent.click(unchecked);
    const filtered = await findByRole('img');

    expect(filtered).toHaveAttribute('alt', 'Gordian Blade');
  });

  it('retains filters from each side', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));

    let icebreaker = await within(filterBlock).findByLabelText('Icebreaker');
    fireEvent.click(icebreaker);
    fireEvent.click(getByText('Corp'));

    const codeGate = await within(filterBlock).findByLabelText('Code Gate');
    fireEvent.click(codeGate);
    fireEvent.click(getByText('Runner'));

    icebreaker = await within(filterBlock).findByLabelText('Icebreaker');

    expect(icebreaker).toBeChecked();
  });

  it('does not apply filters to the wrong side', async () => {
    const { getByTestId, getByText, findAllByRole } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));

    const icebreaker = await within(filterBlock).findByLabelText('Icebreaker');
    fireEvent.click(icebreaker);
    fireEvent.click(getByText('Corp'));

    const cards = await findAllByRole('img');

    expect(cards).toHaveLength(4);
  });

  it('includes filters appropriate to both sides', async () => {
    const { getByTestId, getByText } = render(<App />);
    const filterBlock = getByTestId('subtypes-filters');
    fireEvent.click(getByText('Subtypes'));

    let bioroid = await within(filterBlock).findByLabelText('Bioroid');
    fireEvent.click(bioroid);
    fireEvent.click(getByText('Corp'));

    bioroid = await within(filterBlock).findByLabelText('Bioroid');

    expect(bioroid).toBeChecked();
  });
});

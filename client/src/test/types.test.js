import React from 'react';
import { render, within, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Types filters', () => {
    it('renders with no options to begin with', () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        const checkboxes = within(filterBlock)
            .queryAllByRole('checkbox');

        expect(checkboxes).toHaveLength(0);
    });

    it('loads some checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(5);
    });

    it('starts with empty checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        })
    });

    it('loads some checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(6);
    });

    it('starts with empty checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        })
    });

    it('has the correct title', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        const heading = await within(filterBlock)
            .findByRole('heading');

        expect(heading).toHaveTextContent('Types');
    });

    it('selects checkboxes correctly', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        const unchecked = await within(filterBlock)
            .findAllByRole('checkbox');

        fireEvent.click(unchecked[0]);

        const checked = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checked[0]).toBeChecked();
    });

    it('filters cards correctly', async () => {
        const { getByTestId, findAllByRole, findByRole } = render(<App />);
        const filterBlock = getByTestId('types-filters');
        const unchecked = await within(filterBlock)
            .findByLabelText('Hardware');
        const all = await findAllByRole('img');

        expect(all).toHaveLength(3);

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        expect(filtered).toHaveAttribute('alt', 'R&D Interface');
    });

    it('retains filters from each side', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('types-filters');

        let hardware = await within(filterBlock)
            .findByLabelText('Hardware');
        fireEvent.click(hardware);
        fireEvent.click(getByText('Corp'));

        let agenda = await within(filterBlock)
            .findByLabelText('Agenda');
        fireEvent.click(agenda);
        fireEvent.click(getByText('Runner'));

        hardware = await within(filterBlock)
            .findByLabelText('Hardware');

        expect(hardware).toBeChecked();
    });
});

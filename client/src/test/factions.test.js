import React from 'react';
import { render, within, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Faction filters', () => {
    it('loads some checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(3);
    });

    it('starts with empty checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        })
    });

    it('loads some checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(2);
    });

    it('starts with empty checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        })
    });

    it('has the correct title', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        const heading = await within(filterBlock)
            .findByRole('heading');

        expect(heading).toHaveTextContent('Factions');
    });

    it('selects checkboxes correctly', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        const unchecked = await within(filterBlock)
            .findAllByRole('checkbox');

        fireEvent.click(unchecked[0]);

        const checked = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checked[0]).toBeChecked();
    });

    it('filters cards correctly', async () => {
        const { getByTestId, findAllByRole, findByRole } = render(<App />);
        const filterBlock = getByTestId('factions-filters');
        const unchecked = await within(filterBlock)
            .findByLabelText('Anarch');
        const all = await findAllByRole('img');

        expect(all).toHaveLength(3);

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        expect(filtered).toHaveAttribute('alt', 'D4v1d');
    });

    it('retains filters from each side', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('factions-filters');

        let anarch = await within(filterBlock)
            .findByLabelText('Anarch');
        fireEvent.click(anarch);
        fireEvent.click(getByText('Corp'));

        let jinteki = await within(filterBlock)
            .findByLabelText('Jinteki');
        fireEvent.click(jinteki);
        fireEvent.click(getByText('Runner'));

        anarch = await within(filterBlock)
            .findByLabelText('Anarch');

        expect(anarch).toBeChecked();
    });
});

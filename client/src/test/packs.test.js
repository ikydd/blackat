import React from 'react';
import { render, within, fireEvent } from '@testing-library/react';
import App from '../App';
import packs from '../../../fixtures/api/cycles';

jest.mock('../helpers/api');

describe('Packs filters', () => {
    it('has the correct title', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const heading = await within(filterBlock)
            .findByRole('heading');

        expect(heading).toHaveTextContent('Packs');
    });

    it('starts with no checkboxes', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const checkboxes = await within(filterBlock)
            .queryAllByRole('checkbox');

        expect(checkboxes).toHaveLength(0);
    });

    it('shows all checkboxes', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        const totalChecks = packs
            .reduce((total, group) => total + (group.items.length > 1 ? (group.items.length + 1) : 1), 0);

        expect(checkboxes).toHaveLength(totalChecks);
    });

    it('starts with empty checkboxes', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        })
    });

    it('shows the same checkboxes when corp is selected', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        const totalChecks = packs
            .reduce((total, group) => total + (group.items.length > 1 ? (group.items.length + 1) : 1), 0);

        expect(checkboxes).toHaveLength(totalChecks);
    });

    it('selects checkboxes correctly', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));
        const unchecked = await within(filterBlock)
            .findAllByRole('checkbox');

        fireEvent.click(unchecked[0]);

        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');
        const checked = checkboxes.shift();

        expect(checked).toBeChecked();
        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        });
    });

    it('filters cards correctly', async () => {
        const { getByTestId, findAllByRole, findByRole, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));
        const unchecked = await within(filterBlock)
            .findByLabelText('What Lies Ahead');
        const all = await findAllByRole('img');

        expect(all).toHaveLength(3);

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        expect(filtered).toHaveAttribute('alt', 'D4v1d');
    });

    it('includes filters for both sides', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));

        let wla = await within(filterBlock)
            .findByLabelText('What Lies Ahead');
        fireEvent.click(wla);
        fireEvent.click(getByText('Corp'));

        wla = await within(filterBlock)
            .findByLabelText('What Lies Ahead');

        expect(wla).toBeChecked();
    });

    it('selects all in a group regardless of current state', async () => {
        const { getByTestId, getByText, findByLabelText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));

        const genesis = packs.find(({ code }) => code === 'genesis');

        const pack = await within(filterBlock)
            .findByLabelText(genesis.items[3].name);
        fireEvent.click(pack);

        const cycle = await findByLabelText(genesis.name);
        fireEvent.click(cycle);

        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        const checked = checkboxes
            .filter(({ checked }) => checked)
            .map((item) => item.getAttribute('value'));

        const expected = ['genesis'].concat(genesis.items.map(({ code }) => code));

        expect(checked).toEqual(expected);
    });

    it('retains filters when collapsed', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));
        const unchecked = await within(filterBlock)
            .findAllByRole('checkbox');

        fireEvent.click(unchecked[0]);

        fireEvent.click(getByText('Packs'));
        fireEvent.click(getByText('Packs'));

        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');
        const checked = checkboxes.shift();

        expect(checked).toBeChecked();
        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        });
    });
});

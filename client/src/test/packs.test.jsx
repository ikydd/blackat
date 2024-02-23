import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import packs from '../../../fixtures/api/packs';

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
        const checkboxes = within(filterBlock)
            .queryAllByRole('checkbox');

        await waitFor(() => {
            expect(checkboxes).toHaveLength(0);
        });
    });

    it('shows some checkboxes', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Packs'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checkboxes.length).toBeGreaterThan(0);
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

        const runnerBoxes = await within(filterBlock)
            .findAllByRole('checkbox');

        fireEvent.click(getByText('Corp'));
        const corpBoxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(corpBoxes).toEqual(runnerBoxes);
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

        await waitFor(() => {
            expect(all).toHaveLength(3);
        });

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        await waitFor(() => {
            expect(filtered).toHaveAttribute('alt', 'D4v1d');
        });
    });

    it('retains filters for both sides', async () => {
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

    describe('Cycle Checkbox', () => {
        it('does not select the cycle when a subitem is checked', async () => {
            const { getByTestId, getByText, findByLabelText } = render(<App />);
            const filterBlock = getByTestId('packs-filters');
            fireEvent.click(getByText('Packs'));

            const genesis = packs.find(({ code }) => code === 'genesis');

            const pack = await within(filterBlock)
                .findByLabelText(genesis.items[3].name);
            fireEvent.click(pack);

            const cycle = await findByLabelText(genesis.name);
            expect(cycle).not.toBeChecked();
        });

        it('selects all in a cycle when clicked regardless of their current state', async () => {
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

        it('deselects all in a cycle when deselected', async () => {
            const { getByTestId, getByText, findByLabelText } = render(<App />);
            const filterBlock = getByTestId('packs-filters');
            fireEvent.click(getByText('Packs'));

            const genesis = packs.find(({ code }) => code === 'genesis');

            const pack = await within(filterBlock)
                .findByLabelText(genesis.items[3].name);
            fireEvent.click(pack);

            let cycle = await findByLabelText(genesis.name);
            fireEvent.click(cycle);
            fireEvent.click(cycle);

            const checkboxes = await within(filterBlock)
                .findAllByRole('checkbox');

            const checked = checkboxes
                .filter(({ checked }) => checked)
                .map((item) => item.getAttribute('value'));

            expect(checked).toHaveLength(0);
        });

        it('deselects cycle when not all subitems are checked', async () => {
            const { getByTestId, getByText, findByLabelText } = render(<App />);
            const filterBlock = getByTestId('packs-filters');
            fireEvent.click(getByText('Packs'));

            const genesis = packs.find(({ code }) => code === 'genesis');

            let cycle = await findByLabelText(genesis.name);
            fireEvent.click(cycle);

            const pack = await within(filterBlock)
                .findByLabelText(genesis.items[3].name);
            fireEvent.click(pack);

            cycle = await findByLabelText(genesis.name);
            expect(cycle).not.toBeChecked();
        });
    });
});

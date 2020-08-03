import React from 'react';
import { render, within, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Packs filters', () => {
    it('loads some checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(8);
    });

    it('starts with empty checkboxes for runner', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        })
    });

    it('loads some checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checkboxes).toHaveLength(8);
    });

    it('starts with empty checkboxes for corp', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        fireEvent.click(getByText('Corp'));
        const checkboxes = await within(filterBlock)
            .findAllByRole('checkbox');

        checkboxes.forEach((box) => {
            expect(box).not.toBeChecked();
        })
    });

    it('has the correct title', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const heading = await within(filterBlock)
            .findByRole('heading');

        expect(heading).toHaveTextContent('Packs');
    });

    it('selects checkboxes correctly', async () => {
        const { getByTestId } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const unchecked = await within(filterBlock)
            .findAllByRole('checkbox');

        fireEvent.click(unchecked[0]);

        const checked = await within(filterBlock)
            .findAllByRole('checkbox');

        expect(checked[0]).toBeChecked();
    });

    it('filters cards correctly', async () => {
        const { getByTestId, findAllByRole, findByRole } = render(<App />);
        const filterBlock = getByTestId('packs-filters');
        const unchecked = await within(filterBlock)
            .findByLabelText('What Lies Ahead');
        const all = await findAllByRole('img');

        expect(all).toHaveLength(3);

        fireEvent.click(unchecked);
        const filtered = await findByRole('img');

        expect(filtered).toHaveAttribute('alt', 'D4v1d');
    });

    it('retains filters from each side', async () => {
        const { getByTestId, getByText } = render(<App />);
        const filterBlock = getByTestId('packs-filters');

        let runner = await within(filterBlock)
            .findByLabelText('What Lies Ahead');
        fireEvent.click(runner);
        fireEvent.click(getByText('Corp'));

        let corp = await within(filterBlock)
            .findByLabelText('Future Proof');
        fireEvent.click(corp);
        fireEvent.click(getByText('Runner'));

        runner = await within(filterBlock)
            .findByLabelText('What Lies Ahead');

        expect(runner).toBeChecked();
    });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SortSelect from './SortSelect';

describe('SortSelect', () => {
    it('renders without crashing', () => {
        render(<SortSelect />);
    });

    it('contains a select dropdown field', () => {
        const { getByRole } = render(<SortSelect />);

        expect(getByRole('combobox')).toBeTruthy();
    });

    it('has two options', () => {
        const { getAllByRole } = render(<SortSelect />);

        expect(getAllByRole('option')).toEqual([
            expect.objectContaining({
                textContent: 'Sort by Faction',
                value: 'faction'
            }),
            expect.objectContaining({
                textContent: 'Sort by Name',
                value: 'name'
            })
        ]);
    });

    it('calls a callback on change', async () => {
        const cb = jest.fn();
        const { getByRole } = render(<SortSelect onChange={cb} />);
        const input = getByRole('combobox');

        fireEvent.change(input, { currentTarget: { value: 'faction' } });
        expect(cb).toHaveBeenCalledWith('faction');
    })
});

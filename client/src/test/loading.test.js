import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Loading Spinner', () => {
    it('starts with a loading icon', async () => {
        const { getByRole } = render(<App />);
        const spinner = getByRole('alert');

        expect(spinner).toBeTruthy();
    });

    it('hides the spinner once the cards are loaded', async () => {
        const { getByRole, findAllByRole } = render(<App />);
        await findAllByRole('img');
        const spinner = getByRole('alert');

        expect(spinner).toBeFalsy();
    });

    it('does not show the spinner when no cards are found', async () => {
        const search = 'xxx';
        const { getByPlaceholderText, getByRole } = render(<App />);
        const input = getByPlaceholderText(`search text`);
        fireEvent.input(input, { target: { value: search } });

        const spinner = getByRole('alert');

        expect(spinner).toBeFalsy();
    });
});

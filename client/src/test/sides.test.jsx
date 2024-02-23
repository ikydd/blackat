import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Side selection', () => {
    describe('buttons', () => {
        it('contains both sides', async () => {
            const { getByTestId } = render(<App />);
            const sides = within(getByTestId('sides'))
            .getAllByRole('button')

            await waitFor(() => {
                expect(sides[0]).toHaveTextContent("Runner");
                expect(sides[1]).toHaveTextContent("Corp");
            });
        });

        it('starts on the runner side', async () => {
            const { getByText } = render(<App />);

            await waitFor(() => {
                expect(getByText("Runner")).toHaveClass('selected');
                expect(getByText("Corp")).not.toHaveClass('selected');
            });
        });

        it('selects the correct SideButtons when corp is selected', async () => {
            const { getByText } = render(<App />);

            fireEvent.click(getByText("Corp"));

            await waitFor(() => {
            expect(getByText("Runner")).not.toHaveClass("selected");
            expect(getByText("Corp")).toHaveClass("selected");
            });
        });

        it('selects the correct SideButtons when runner is selected', async () => {
            const { getByText } = render(<App />);

            fireEvent.click(getByText("Corp"));
            fireEvent.click(getByText("Runner"));

            await waitFor(() => {
                expect(getByText("Runner")).toHaveClass("selected");
                expect(getByText("Corp")).not.toHaveClass("selected");
            });
        });
    });

    it('only shows cards from the correct side', async () => {
        const { findAllByRole, getByText } = render(<App />);
        let cards = await findAllByRole('img');

        expect(cards).toHaveLength(3);

        fireEvent.click(getByText("Corp"));
        cards = await findAllByRole('img');

        expect(cards).toHaveLength(4);
    });
});

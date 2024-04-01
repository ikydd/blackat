import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Side selection', () => {
  describe('buttons', () => {
    it('contains both sides', async () => {
      const { findByTestId } = render(<App />);
      const sidesBlock = await findByTestId('sides');
      const sides = within(sidesBlock).getAllByRole('button');

      await waitFor(() => {
        expect(sides[0]).toHaveTextContent('Runner');
        expect(sides[1]).toHaveTextContent('Corp');
      });
    });

    it('starts on the runner side', async () => {
      const { findByText } = render(<App />);
      const corp = await findByText('Corp');
      const runner = await findByText('Runner');

      await waitFor(() => {
        expect(runner).toHaveClass('selected');
        expect(corp).not.toHaveClass('selected');
      });
    });

    it('selects the correct SideButtons when corp is selected', async () => {
      const { findByText } = render(<App />);
      const corp = await findByText('Corp');
      const runner = await findByText('Runner');

      fireEvent.click(corp);

      await waitFor(() => {
        expect(runner).not.toHaveClass('selected');
        expect(corp).toHaveClass('selected');
      });
    });

    it('selects the correct SideButtons when runner is selected', async () => {
      const { findByText } = render(<App />);
      const corp = await findByText('Corp');
      const runner = await findByText('Runner');

      fireEvent.click(corp);
      fireEvent.click(runner);

      await waitFor(() => {
        expect(runner).toHaveClass('selected');
        expect(corp).not.toHaveClass('selected');
      });
    });
  });

  it('only shows cards from the correct side', async () => {
    const { findAllByRole, getByText } = render(<App />);
    let cards = await findAllByRole('img');

    expect(cards).toHaveLength(4);

    fireEvent.click(getByText('Corp'));
    cards = await findAllByRole('img');

    expect(cards).toHaveLength(4);
  });
});

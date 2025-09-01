import React from 'react';
import { render, within, waitFor, screen } from '@testing-library/react';
import { setSide } from './helpers/operations';
import App from '../App';
import { findImageTitles } from './helpers/finders';
import cards from '../../../fixtures/api/cards.json';

jest.mock('../helpers/api');

describe('Side selection', () => {
  describe('buttons', () => {
    it('contains both sides', async () => {
      render(<App />);
      const sidesBlock = await screen.findByTestId('sides');
      const sides = within(sidesBlock).getAllByRole('button');

      await waitFor(() => {
        expect(sides[0]).toHaveTextContent('Runner');
        expect(sides[1]).toHaveTextContent('Corp');
      });
    });

    it('starts on the runner side', async () => {
      render(<App />);
      const corp = await screen.findByText('Corp');
      const runner = await screen.findByText('Runner');

      await waitFor(() => {
        expect(runner).toHaveClass('selected');
        expect(corp).not.toHaveClass('selected');
      });
    });

    it('selects the correct SideButtons when corp is selected', async () => {
      render(<App />);
      const corp = await screen.findByText('Corp');
      const runner = await screen.findByText('Runner');

      await setSide('Corp');

      await waitFor(() => {
        expect(runner).not.toHaveClass('selected');
        expect(corp).toHaveClass('selected');
      });
    });

    it('selects the correct SideButtons when runner is selected', async () => {
      render(<App />);
      const corp = await screen.findByText('Corp');
      const runner = await screen.findByText('Runner');

      await setSide('Corp');
      await setSide('Runner');

      await waitFor(() => {
        expect(runner).toHaveClass('selected');
        expect(corp).not.toHaveClass('selected');
      });
    });
  });

  describe('cards filtering', () => {
    it('only shows cards from the correct side', async () => {
      render(<App />);
      const runner = await findImageTitles('img');

      const getCardsFromSide = (requestedSide) =>
        cards.filter(({ side }) => side === requestedSide).map(({ title }) => title);

      expect(runner).toEqual(getCardsFromSide('runner'));

      await setSide('Corp');
      const corp = await findImageTitles('img');

      expect(corp).toEqual(getCardsFromSide('corp'));
    });
  });
});

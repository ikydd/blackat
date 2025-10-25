import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn(() => ({
      matches: true
    }))
  });
});

it('applies a class correctly for keyboard', async () => {
  render(<App />);

  const main = await screen.findByRole('main');

  expect(main.className).not.toContain('keyboard');

  const changeMode = await screen.findByRole('button', { name: 'Keyboard Exploration' });

  expect(changeMode).toBeTruthy();

  fireEvent.click(changeMode);

  expect(main.className).toContain('keyboard');
});

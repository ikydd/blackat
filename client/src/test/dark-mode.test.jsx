import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Dark mode', () => {
  it('has a button for changing theme', async () => {
    render(<App />);
    const changeTheme = await screen.findByRole('button', { name: 'Change Theme' });

    expect(changeTheme).toBeTruthy();
  });
});

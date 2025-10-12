import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../helpers/api');

describe('Timestamp', () => {
  it('has the last time updated', async () => {
    render(<App />);

    const stamp = await screen.findByText(/Data updated/);

    expect(stamp).toHaveTextContent('Data updated: 2 September 2025');
  });
});

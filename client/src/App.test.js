import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('./helpers/api');

it('renders without crashing', () => {
  render(<App />);
});

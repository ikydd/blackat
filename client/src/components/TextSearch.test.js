import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TextSearch from './TextSearch';

describe('TextSearch', () => {
    it('renders without crashing', () => {
        render(<TextSearch />);
    });

    it('contains a text input field', () => {
        const { getByRole } = render(<TextSearch />);

        expect(getByRole('textbox')).toBeTruthy();
    });

    it('sets placeholder a placeholder from a prop', () => {
        const { getByRole } = render(<TextSearch placeholder="foo" />);

        expect(getByRole('textbox')).toHaveAttribute('placeholder', "foo");
    });

    it('has a default placeholder of "search"', () => {
        const { getByRole } = render(<TextSearch />);

        expect(getByRole('textbox')).toHaveAttribute('placeholder', "search");
    });

    it('calls a callback on input', async () => {
      const cb = jest.fn();
      const { getByRole } = render(<TextSearch onChange={cb} />);
      const input = getByRole('textbox');

      fireEvent.change(input, { target: { value: 'abc' } });
      expect(cb).toHaveBeenCalledWith('abc');
    })
});

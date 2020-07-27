import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { shallow } from 'enzyme';
import TextSearch from './TextSearch';

describe('TextSearch', () => {
    it('renders without crashing', () => {
        shallow(<TextSearch />);
    });

    it('contains a text input field', () => {
        const component = shallow(<TextSearch />);

        expect(component.find('input').length).toEqual(1);
    });

    it('sets placeholder a placeholder from a prop', () => {
        const component = shallow(<TextSearch placeholder="foo" />);

        expect(component.find('input').prop('placeholder')).toEqual("foo");
    });

    it('has a default placeholder of "search"', () => {
        const component = shallow(<TextSearch />);

        expect(component.find('input').prop('placeholder')).toEqual("search");
    });

    it('calls a callback on input', async () => {
      const cb = jest.fn();
      const { container } = render(<TextSearch onChange={cb} />);

      fireEvent.change(container.querySelector('input'), { target: { value: 'abc' } });
      expect(cb).toHaveBeenCalledWith('abc');
    })
});

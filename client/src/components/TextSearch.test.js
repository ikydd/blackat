import React from 'react';
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
});

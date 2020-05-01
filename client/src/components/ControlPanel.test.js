import React from 'react';
import { create }  from 'react-test-renderer';
import { waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
import ControlPanel from './ControlPanel';
import SideButton from './SideButton';

jest.mock('../helpers/api');
jest.mock('./SideButton', () => 'SideButton');

describe('CardList', () => {
  it('renders without crashing', () => {
    shallow(<ControlPanel/>);
  });
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SideButton from './SideButton';

describe('SideButton', () => {
  it('renders without crashing', () => {
    expect(() => render(<SideButton />)).not.toThrow();
  });

  it('uses the name passed in', () => {
    const title = 'Foo';
    const { container } = render(<SideButton title={title} />);

    expect(container.firstChild).toHaveTextContent(title);
  });

  it('has the class side-button', () => {
    const title = 'Foo';
    const { container } = render(<SideButton title={title} />);

    expect(container.firstChild).toHaveClass('side-button');
  });

  it('displays as selected depending on props', () => {
    const title = 'Foo';
    const isSelected = true;
    const { container } = render(<SideButton title={title} selected={isSelected} />);

    expect(container.firstChild).toHaveClass('selected');
  });

  it('calls a callback when clicked on and not selected', () => {
    const title = 'Foo';
    const side = 'foo';
    const isSelected = false;
    const cb = jest.fn();
    const { container } = render(
      <SideButton title={title} side={side} selected={isSelected} onSelect={cb} />
    );
    fireEvent.click(container.firstChild);

    expect(cb).toHaveBeenCalledWith(side);
  });

  it('does not call a callback when clicked on and already selected', () => {
    const title = 'Foo';
    const side = 'foo';
    const isSelected = true;
    const cb = jest.fn();
    const { container } = render(
      <SideButton title={title} side={side} selected={isSelected} onSelect={cb} />
    );
    fireEvent.click(container.firstChild);

    expect(cb).not.toHaveBeenCalled();
  });
});

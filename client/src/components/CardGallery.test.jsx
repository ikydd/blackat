import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CardGallery from './CardGallery';

const cards = [
  {
    code: 'foo',
    name: 'Foo',
    cards: [
      { title: 'Alpha', imagesrc: 'card.jpg' },
      { title: 'Beta', imagesrc: 'card.jpg' },
      { title: 'Gamma', imagesrc: 'card.jpg' }
    ]
  },
  {
    code: 'bar',
    name: 'Bar',
    cards: [
      { title: 'One', imagesrc: 'card.jpg' },
      { title: 'Two', imagesrc: 'card.jpg' },
      { title: 'Three', imagesrc: 'card.jpg' }
    ]
  }
];

describe('CardGallery', () => {
  it('renders', async () => {
    expect(() => render(<CardGallery sections={[]} />)).not.toThrow();
  });
  it('cards are not focusable by default', async () => {
    await render(<CardGallery sections={cards} />);

    const beta = screen.getByTitle('Beta');
    beta.focus();

    expect(beta).not.toHaveFocus();
  });

  it('focus on click', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const beta = screen.getByTitle('Beta');
    beta.focus();

    expect(beta).toHaveFocus();
  });
  it('blurs on escape', async () => {
    const { container } = await render(<CardGallery sections={cards} tabbable />);

    const beta = screen.getByTitle('Beta');
    beta.focus();
    fireEvent.keyUp(container, { key: 'Escape' });

    expect(beta).not.toHaveFocus();
  });

  it('navigates left', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const beta = screen.getByTitle('Beta');
    beta.focus();
    fireEvent.keyUp(document, { key: 'ArrowLeft' });

    expect(screen.getByTitle('Alpha')).toHaveFocus();
  });

  it('stops at the beginning when going left', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const alpha = screen.getByTitle('Alpha');
    alpha.focus();
    fireEvent.keyUp(document, { key: 'ArrowLeft' });

    expect(screen.getByTitle('Alpha')).toHaveFocus();
  });

  it('navigates right', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const beta = screen.getByTitle('Beta');
    beta.focus();
    fireEvent.keyUp(document, { key: 'ArrowRight' });

    expect(screen.getByTitle('Gamma')).toHaveFocus();
  });

  it('stops at the end when going right', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const three = screen.getByTitle('Three');
    three.focus();
    fireEvent.keyUp(document, { key: 'ArrowRight' });

    expect(screen.getByTitle('Three')).toHaveFocus();
  });

  it('navigates across sections left', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const one = screen.getByTitle('One');
    one.focus();
    fireEvent.keyUp(document, { key: 'ArrowLeft' });

    expect(screen.getByTitle('Gamma')).toHaveFocus();
  });

  it('navigates across sections right', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const gamma = screen.getByTitle('Gamma');
    gamma.focus();
    fireEvent.keyUp(document, { key: 'ArrowRight' });

    expect(screen.getByTitle('One')).toHaveFocus();
  });

  it('right key down even does nothing if not held', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const alpha = screen.getByTitle('Alpha');
    alpha.focus();
    fireEvent.keyDown(document, { key: 'ArrowRight', repeat: false });

    expect(screen.getByTitle('Alpha')).toHaveFocus();
  });

  it('holding the right key down moves fast', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const alpha = screen.getByTitle('Alpha');
    alpha.focus();
    fireEvent.keyDown(document, { key: 'ArrowRight', repeat: true });
    fireEvent.keyDown(document, { key: 'ArrowRight', repeat: true });
    fireEvent.keyDown(document, { key: 'ArrowRight', repeat: true });
    fireEvent.keyDown(document, { key: 'ArrowRight', repeat: true });

    expect(screen.getByTitle('Two')).toHaveFocus();
  });

  it('left key down even does nothing if not held', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const beta = screen.getByTitle('Beta');
    beta.focus();
    fireEvent.keyDown(document, { key: 'ArrowLeft', repeat: false });

    expect(screen.getByTitle('Beta')).toHaveFocus();
  });

  it('holding the left key down moves fast', async () => {
    await render(<CardGallery sections={cards} tabbable />);

    const two = screen.getByTitle('Two');
    two.focus();
    fireEvent.keyDown(document, { key: 'ArrowLeft', repeat: true });
    fireEvent.keyDown(document, { key: 'ArrowLeft', repeat: true });
    fireEvent.keyDown(document, { key: 'ArrowLeft', repeat: true });
    fireEvent.keyDown(document, { key: 'ArrowLeft', repeat: true });

    expect(screen.getByTitle('Alpha')).toHaveFocus();
  });
});

import React, { useEffect } from 'react';
import CardSection from './CardSection';
import Empty from './Empty';

const getNextElement = (element) => {
  if (element.nextSibling) {
    return element.nextSibling;
  }
  if (element.parentNode.parentNode.nextSibling) {
    return [
      ...element.parentNode.parentNode.nextSibling.getElementsByClassName('card-tile')
    ].shift();
  }
  return null;
};

const getPrevElement = (element) => {
  if (element.previousSibling) {
    return element.previousSibling;
  }
  if (element.parentNode.parentNode.previousSibling) {
    return [
      ...element.parentNode.parentNode.previousSibling.getElementsByClassName('card-tile')
    ].pop();
  }
  return null;
};

const focusNextElement = (element) => {
  const next = getNextElement(element);
  if (next) {
    next.focus();
  }
};

const focusPrevElement = (element) => {
  const prev = getPrevElement(element);
  if (prev) {
    prev.focus();
  }
};

const handleKeypress = (key) => {
  if (key === 'ArrowLeft') {
    focusPrevElement(document.activeElement);
  }
  if (key === 'ArrowRight') {
    focusNextElement(document.activeElement);
  }
};

const keyboardNavigation = (e) => {
  if (e.key === 'Escape') {
    document.activeElement.blur();
  }
  if (document.activeElement.classList.contains('card-tile')) {
    handleKeypress(e.key);
  }
};

const keyboardNavigationHold = (e) => {
  if (document.activeElement.classList.contains('card-tile') && e.repeat) {
    handleKeypress(e.key);
  }
};

const CardGallery = ({ sections, tabbable }) => {
  const empty = sections.length === 0;

  useEffect(() => {
    document.addEventListener('keyup', keyboardNavigation);
    document.addEventListener('keydown', keyboardNavigationHold);

    return () => {
      document.removeEventListener('keyup', keyboardNavigation);
      document.addEventListener('keydown', keyboardNavigationHold);
    };
  });

  return (
    <div id="cards" data-testid="cards">
      <h2 className="sr-only">Card Gallery</h2>
      {sections.map((section, index) => (
        <CardSection key={index} section={section} tabbable={tabbable} />
      ))}
      {empty && <Empty />}
    </div>
  );
};

export default CardGallery;

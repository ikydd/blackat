import React, { useEffect } from 'react';
import CardSection from './CardSection';
import Empty from './Empty';

const CardGallery = ({ sections }) => {
  const empty = sections.length === 0;

  useEffect(() => {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
    });
  });

  return (
    <div id="cards" data-testid="cards">
      <h2 className="sr-only">Card Gallery</h2>
      {sections.map((section, index) => (
        <CardSection key={index} section={section} />
      ))}
      {empty && <Empty />}
    </div>
  );
};

export default CardGallery;

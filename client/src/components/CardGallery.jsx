import React, { useState } from 'react';
import CardSection from './CardSection';
import Empty from './Empty';

const CardGallery = ({ sections }) => {
  const [currentFocus, setCurrentFocus] = useState();

  const empty = sections.length === 0;

  return (
    <div id="cards">
      <h2 className="sr-only">Card Gallery</h2>
      {sections.map((section, index) => (
        <CardSection
          key={index}
          section={section}
          currentFocus={currentFocus}
          focusHandler={setCurrentFocus}
        />
      ))}
      {empty && <Empty />}
    </div>
  );
};

export default CardGallery;

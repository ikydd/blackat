import React, { useEffect, useState } from 'react';
import CardSection from './CardSection';
import Loader from './Loader';
import Empty from './Empty';
import { getData } from '../helpers/api';
import filterCards from '../helpers/filter-cards';
import group from '../helpers/group';
import sort from '../helpers/sort';
import './CardList.css';

const CardList = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [cards, setCards] = useState([]);
  const [sorter, setSorter] = useState(() => () => {});
  const [grouper, setGrouper] = useState(() => () => () => {});

  useEffect(() => {
    Promise.all([getData('cards'), getData('factions'), getData('types'), getData('packs')])
      .then(([loadedCards, factions, types, packs]) => {
        setSorter(() => sort({ factions, types, packs }));
        setGrouper(() => group({ factions, types, packs }));
        setCards(loadedCards);
        setLoaded(true);
      })
      /* eslint-disable-next-line no-console */
      .catch((err) => console.log(err));
  }, []);

  const filteredCards = filterCards(cards, props);
  const sortedCards = filteredCards.sort(sorter(props.sort));
  const reducedCards = sortedCards.reduce(grouper(props.sort), {});

  const sections = Object.values(reducedCards);

  const empty = sections.reduce((acc, { show }) => (show ? false : acc), true);

  return (
    <div id="cards">
      {loaded ? '' : <Loader />}
      {sections.map((section, index) => (
        <CardSection key={index} section={section}></CardSection>
      ))}
      {loaded && empty ? <Empty /> : ''}
    </div>
  );
};

export default CardList;

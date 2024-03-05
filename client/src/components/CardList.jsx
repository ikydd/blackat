import React, { useEffect, useState } from 'react';
import CardSection from './CardSection';
import Loader from './Loader';
import Empty from './Empty';
import getData from '../helpers/api';
import filterCards from '../helpers/filter-cards';
import { prepareGroupingData, groupCards } from '../helpers/group-cards';
import { prepareSortingData, sortCards } from '../helpers/sort-cards';
import './CardList.css';

const CardList = ({ art, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [cards, setCards] = useState([]);
  const [sortingData, setSortingData] = useState();
  const [groupingData, setGroupingData] = useState();

  useEffect(() => {
    Promise.all([getData('cards'), getData('factions'), getData('types'), getData('packs')])
      .then(([loadedCards, factions, types, packs]) => {
        setSortingData(() => prepareSortingData({ factions, types, packs }));
        setGroupingData(() => prepareGroupingData({ factions, types, packs }));
        setCards(loadedCards);
        setLoaded(true);
      })
      /* eslint-disable-next-line no-console */
      .catch((err) => console.log(err));
  }, []);

  const filteredCards = filterCards(cards, props);
  const sortedCards = sortCards(filteredCards, sortingData, props.sort);
  const sections = groupCards(sortedCards, groupingData, props.sort);

  const empty = !sections.some(({ show }) => show);

  return (
    <div id="cards">
      {loaded ? '' : <Loader />}
      {sections.map((section, index) => (
        <CardSection key={index} section={section} art={art}></CardSection>
      ))}
      {loaded && empty ? <Empty /> : ''}
    </div>
  );
};

export default CardList;

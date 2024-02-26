import React, { useEffect, useState } from 'react';
import CardSection from './CardSection';
import Loader from './Loader';
import Empty from './Empty';
import getData from '../helpers/api';
import filterCards from '../helpers/filter-cards';
import { prepareGroupingData, prepareGroupingAlgo } from '../helpers/group';
import { prepareSortingData, prepareSortingAlgo } from '../helpers/sort-cards';
import './CardList.css';

const CardList = (props) => {
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

  const sortCardsByMethod = prepareSortingAlgo(sortingData, props.sort);
  const groupCardsByCategoryItems = prepareGroupingAlgo(groupingData, props.sort);

  const filteredCards = filterCards(cards, props);
  const sortedCards = filteredCards.sort(sortCardsByMethod);
  const reducedCards = sortedCards.reduce(groupCardsByCategoryItems, {});

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

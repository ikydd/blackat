import React,{ useEffect, useState } from 'react';
import CardSection from './CardSection';
import Loader from './Loader';
import Empty from './Empty';
import { getData } from '../helpers/api';
import filter from '../helpers/filter';
import group from '../helpers/group';
import sort from '../helpers/sort';
import './CardList.css';

const CardList = ({ sort: sortMethod, ...props }) => {
  // const [loaded, setLoaded] = useState(false);
  // const [cards, setCards] = useState([]);
  // const [sortOptions, setSortOptions] = useState(() => () => () => 0);
  // const [groupOptions, setGroupOptions] = useState(() => () => acc => acc);

  const handleData = ([cards, factions, types, packs]) => {
    setThings({
      loaded: true,
      cards,
      sort: sort({ factions, types, packs }),
      group: group({ factions, types, packs })
    });
  };

  const [things, setThings] = useState({
    loaded: false,
    cards: [],
    sort: () => {},
    group: () => () => {}
  })

  useEffect(() => {
    Promise.all([getData('cards'), getData('factions'), getData('types'), getData('packs')])
      .then(handleData)
      .catch(err => console.log(err));
  }, []);

  const filteredCards = filter(things.cards, props);
  const sortedCards = filteredCards.sort(things.sort(sortMethod));
  const reducedCards = sortedCards.reduce(things.group(sortMethod), {});

  const sections = Object.values(reducedCards );

  const empty = sections.reduce((acc, { show }) => show ? false : acc, true)

  return (
    <div id="cards">
      {things.loaded ? "" : <Loader/>}
      {sections.map((section, index) => <CardSection key={index} section={section}></CardSection>)}
      {things.loaded && empty ? <Empty/> : ""}
    </div>
  );
}

export default CardList;

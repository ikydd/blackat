import React, { useEffect, useState } from 'react'
import CardSection from './CardSection'
import Loader from './Loader'
import Empty from './Empty'
import { getData } from '../helpers/api'
import filter from '../helpers/filter'
import group from '../helpers/group'
import sort from '../helpers/sort'
import './CardList.css'

const CardList = (props) => {
  const [things, setThings] = useState({
    loaded: false,
    cards: [],
    sort: () => {},
    group: () => () => {},
  })

  const handleData = ([cards, factions, types, packs]) => {
    setThings({
      loaded: true,
      cards,
      sort: sort({ factions, types, packs }),
      group: group({ factions, types, packs }),
    })
  }

  useEffect(() => {
    Promise.all([
      getData('cards'),
      getData('factions'),
      getData('types'),
      getData('packs'),
    ])
      .then(handleData)
      .catch((err) => console.log(err))
  }, [])

  const filteredCards = filter(things.cards, props)
  const sortedCards = filteredCards.sort(things.sort(props.sort))
  const reducedCards = sortedCards.reduce(things.group(props.sort), {})

  const sections = Object.values(reducedCards)

  const empty = sections.reduce((acc, { show }) => (show ? false : acc), true)

  return (
    <div id="cards">
      {things.loaded ? '' : <Loader />}
      {sections.map((section, index) => (
        <CardSection key={index} section={section}></CardSection>
      ))}
      {things.loaded && empty ? <Empty /> : ''}
    </div>
  )
}

export default CardList

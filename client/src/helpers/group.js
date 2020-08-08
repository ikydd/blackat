
const group = ({ factions }) => (sort) => (sections, card) => {
    if (sort === 'faction') {
        if (!sections[card.faction]) {
            sections[card.faction] = {
                info: factions.find(({ code }) => code === card.faction),
                cards: []
            };
        }
        sections[card.faction].cards.push(card);
        return sections;
    } else {
        if (!sections['default']) {
            sections['default'] = {
                info: null,
                cards: []
            };
        }
        sections['default'].cards.push(card);
        return sections;
    }
}

export default group;

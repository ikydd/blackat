
const group = ({ factions, packs, types }) => (sort) => (sections, card) => {
    switch (sort) {
        case 'faction':
            if (!sections[card.faction]) {
                sections[card.faction] = {
                    info: factions.find(({ code }) => code === card.faction),
                    cards: []
                };
            }
            sections[card.faction].cards.push(card);
            return sections;
        case 'pack':
            if (!sections[card.pack]) {
                sections[card.pack] = {
                    info: packs.find(({ code }) => code === card.pack),
                    cards: []
                };
            }
            sections[card.pack].cards.push(card);
            return sections;
        case 'type':
            if (!sections[card.type]) {
                sections[card.type] = {
                    info: types.find(({ code }) => code === card.type),
                    cards: []
                };
            }
            sections[card.type].cards.push(card);
            return sections;
        default:
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

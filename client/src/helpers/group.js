
const data = {}

const ensureSection = (sections, list = [], prop = 'default') => {
    if (!sections[prop]) {
        sections[prop] = {
            show: false,
            info: list.find(({ code }) => code === prop),
            cards: []
        }
    }
}

const addCard = (section, card) => {
    section.show = card.show ? true : section.show;
    section.cards.push(card);

}

const standardGroup = (sections, card, sort) => {
    const prop = card[sort];
    const list = data[sort];
    ensureSection(sections, list, prop);
    addCard(sections[prop], card);
    return sections;
}

const defaultGroup = (sections, card) => {
    ensureSection(sections);
    addCard(sections['default'], card);
    return sections;
}

const group = ({ factions, packs, types }) => (sort) => (sections, card) => {
    data.type = types;
    data.pack = packs;
    data.faction = factions;
    switch (sort) {
        case 'faction':
        case 'pack':
        case 'type':
            return standardGroup(sections, card, sort);
        default:
            return defaultGroup(sections, card);
    }
}

export default group;

const hasKeywords = ({ keywords }) => keywords;

const alreadyPresent = (list) => ({ name, side }) => {
    const subtype = list.get(name);
    if (!subtype) {
        return true
    }
    return subtype.side !== side && subtype.side !== null;
}

const addSubtype = (list) => ({ name, side }) => {
    const subtype = list.get(name);
    const item = {
        name,
        side: subtype ? null : side
    }

    list.set(name, item);
    return subtype;
}

const buildSubtype = (side) => (name) => ({
    side,
    name
});

const toAccumulator = (list) => list;

const byName = (a, b) => a.name > b.name ? 1 : -1;

const process = (cards) => [...cards
        .filter(hasKeywords)
        .reduce((list, { side, keywords }) => keywords
            .split(' - ')
            .map(buildSubtype(side))
            .filter(alreadyPresent(list))
            .map(addSubtype(list))
            .reduce(toAccumulator, list), new Map())
        .values()]
        .sort(byName);

module.exports = process;

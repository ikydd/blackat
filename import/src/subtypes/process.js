const process = (cards) => {
    const deduped = new Set();
    let subtypes = [];
    cards
        .filter(({ keywords }) => keywords)
        .forEach(({ side, keywords }) => {
            subtypes = keywords
                .split(' - ')
                .map((name) => ({
                    side,
                    name
                }))
                .filter(({ name }) => !deduped.has(name))
                .map((subtype) => {
                    deduped.add(subtype.name);
                    return subtype;
                })
                .concat(subtypes);
        });
    return subtypes.sort((a, b) => a.name > b.name ? 1 : -1);
}

module.exports = process;

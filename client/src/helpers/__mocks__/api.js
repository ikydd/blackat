const cards = require('../../../../fixtures/api/cards');
const factions = require('../../../../fixtures/api/factions');
const types = require('../../../../fixtures/api/types');
const packs = require('../../../../fixtures/api/packs');

const data = {
    cards,
    factions,
    types,
    packs
}

export async function getData (type) {
    return data[type];
}

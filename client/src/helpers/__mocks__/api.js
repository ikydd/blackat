const cards = require('../../../../fixtures/api/cards');
const factions = require('../../../../fixtures/api/factions');
const types = require('../../../../fixtures/api/types');
const packs = require('../../../../fixtures/api/packs');
const subtypes = require('../../../../fixtures/api/subtypes');

const data = {
    cards,
    factions,
    types,
    subtypes,
    packs
}

export async function getData (type) {
    return data[type];
}

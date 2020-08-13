const cards = require('../../../../fixtures/api/cards');
const factions = require('../../../../fixtures/api/factions');
const types = require('../../../../fixtures/api/types');
const packs = require('../../../../fixtures/api/cycles');
const subtypes = require('../../../../fixtures/api/subtypes');

const data = {
    cards,
    factions,
    types,
    subtypes,
    packs
}

let user = {}

const getData = async (type) => user[type] || data[type];

export { getData };

export function setData (type, data) {
    user[type] = data;
}

export function reset () {
    user = {}
}

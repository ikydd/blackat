const cards = require('./cards/import');

const run = async () => {
    await cards();
}

module.exports = {
    run
}

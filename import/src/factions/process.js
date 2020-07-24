const process = ({ data: factions }) => factions
    .map(({ name, code, side_code }) => ({
        code,
        name,
        side: side_code
    }));

module.exports = process

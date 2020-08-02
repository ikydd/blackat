const process = ({ data: factions }) => factions
    .map(({ name, code, side_code }) => ({
        code,
        name,
        side: side_code
    }))
    .sort((a, b) => a.name > b.name ? 1 : -1)

module.exports = process

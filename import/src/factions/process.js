const process = ({ data: factions }) => {
    return factions.map(({ name, code, side_code }) => ({
        code,
        name,
        side: side_code
    }));
}

module.exports = process

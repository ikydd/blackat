const typeList = ['identity', 'program', 'hardware', 'resource',
'event', 'agenda', 'ice', 'asset', 'upgrade', 'operation'];

const process = ({ data: types }) => types
    .filter(({ is_subtype }) => !is_subtype)
    .map(({ name, code, side_code }) => ({
        code,
        name,
        side: side_code
    }))
    .sort((a, b) => typeList.indexOf(a.code) > typeList.indexOf(b.code) ? 1 : -1);

module.exports = process

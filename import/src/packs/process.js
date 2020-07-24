const process = ({ data: types }) => types
    .filter(({ date_release }) => date_release < "2018-09-07")
    .map(({ name, code }) => ({
        code,
        name
    }));

module.exports = process

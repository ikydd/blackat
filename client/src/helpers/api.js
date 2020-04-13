const call = async (path) => {
    const response = await fetch(`/api${path}`);
    const body = await response.json();
    return body;
}

module.exports = {
    call
}
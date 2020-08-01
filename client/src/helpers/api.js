
export async function call (path) {
    const response = await fetch(`/data${path}.json`);
    const body = await response.json();
    return body;
}

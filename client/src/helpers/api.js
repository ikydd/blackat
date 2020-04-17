
export async function call (path) {
    const response = await fetch(`/api${path}`);
    const body = await response.json();
    return body;
}
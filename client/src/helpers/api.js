export default async function getData(path) {
  const response = await fetch(`/data/${path}.json`, {
    headers: { 'Accept-Encoding': 'gzip' }
  });
  const body = await response.json();
  return body;
}

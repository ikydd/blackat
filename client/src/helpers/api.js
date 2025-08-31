export default async function getData(path) {
  const response = await fetch(`/data/${path}.json`, {
    headers: { 'Accept-Encoding': 'gzip' }
  });
  return response.json();
}

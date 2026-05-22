const loadFile = async (path) => {
  const { default: data } = await import(`@repo/testing-fixtures/${path}`);
  return data;
};

export default loadFile;

const fromSide =
  (currentSide) =>
  ({ side }) =>
    !side || side === currentSide;

const getOptions = (options, side) => options.filter(fromSide(side));

export default {
  options: getOptions
};

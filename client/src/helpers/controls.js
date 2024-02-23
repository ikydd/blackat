const setSingle = (item, checked) => (option) =>
  option.code === item.code ? { ...option, selected: checked } : option;

const setAll = (checked) => (option) => ({ ...option, selected: checked });

const fromSide =
  (currentSide) =>
  ({ side }) =>
    !side || side === currentSide;

const clearFilters = (options) => options.map(setAll(false));

const clearFilterGroup = (options) =>
  options.map((group) => ({
    ...group,
    selected: false,
    items: group.items.map(setAll(false))
  }));

const setFilter = (options, item, checked) => options.map(setSingle(item, checked));

const getFilter = (options, side) =>
  options
    .filter(fromSide(side))
    .reduce((filters, option) => filters.concat(option), [])
    .filter(({ selected }) => selected)
    .map(({ code }) => code);

const getNestedFilter = (options, side) =>
  options
    .filter(fromSide(side))
    .reduce((filters, option) => filters.concat(option.items), [])
    .filter(({ selected }) => selected)
    .map(({ code }) => code);

const getOptions = (options, side) => options.filter(fromSide(side));

const setFilterGroup = (options, item, checked) =>
  options.map((option) =>
    option.code === item.code
      ? { ...option, selected: checked, items: item.items.map(setAll(checked)) }
      : option
  );

const setFilterItem = (options, item, checked) =>
  options
    .map((option) => ({
      ...option,
      items: option.items.map(setSingle(item, checked))
    }))
    .map((option) => ({
      ...option,
      selected: !option.items.find(({ selected }) => !selected)
    }));

export const filters = {
  get: getFilter,
  set: setFilter,
  clear: clearFilters,
  options: getOptions
};

export const nestedFilters = {
  get: getNestedFilter,
  setGroup: setFilterGroup,
  setItem: setFilterItem,
  clear: clearFilterGroup
};

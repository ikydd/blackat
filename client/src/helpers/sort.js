const typeOrder = [
    'identity',
    'program',
    'hardware',
    'resource',
    'event',
    'agenda',
    'ice',
    'asset',
    'upgrade',
    'operation'
];

const compare = (a, b) => a > b
      ? 1
      : (a < b
        ? -1
        : 0);

const getFactionForSort = ({ faction }) => faction.search('neutral') !== -1 ? 'zzzzzz' : faction;

const sort = (type, a, b, result = 0) => {
    if (result !== 0) {
      return result;
    }
    switch (type) {
      case 'type':
        return compare(typeOrder.indexOf(a.type), typeOrder.indexOf(b.type));
      case 'faction':
        return compare(getFactionForSort(a), getFactionForSort(b));
      case 'name':
      default:
        return compare(a.title, b.title);
    }
  }



export default (type) => (a, b) => {
    switch (type) {
      case 'name':
          return sort('name', a, b);
      case 'faction':
      default:
        let result = sort('faction', a, b);
        result = sort('type', a, b, result);
        return sort('name', a, b, result);
    }
  }

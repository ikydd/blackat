const isPreferredArt = (card, originalArt, index, list) => {
  const previous = list[index - 1];
  const next = list[index + 1];

  const hasOriginalArt = previous && previous.title === card.title;
  const hasUpdatedArt = next && next.title === card.title;

  if (hasOriginalArt && hasUpdatedArt) {
    return false;
  }
  if (originalArt && hasOriginalArt) {
    return false;
  }
  if (hasUpdatedArt) {
    return originalArt;
  }

  return true;
};

const filterPreferredArt = (cards, { originalArt }) =>
  cards.filter((card, index, list) => isPreferredArt(card, originalArt, index, list));

export default filterPreferredArt;

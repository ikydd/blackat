// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, within } from '@testing-library/react';

export const findImageTitles = async () => {
  const images = await screen.findAllByRole('img');
  return images.map(({ alt }) => alt);
};

export const findSectionHeadings = async () => {
  const cardGallery = screen.getByTestId('cards');

  return (await within(cardGallery).findAllByRole('heading'))
    .slice(1)
    .map(({ textContent }) => textContent.trim());
};

export const findBlock = async (section) => {
  return screen.findByTestId(`${section}-filters`);
};

export const findCheckboxes = async (section) => {
  const filterBlock = await findBlock(section);
  return within(filterBlock).queryAllByRole('checkbox');
};
export const findCheckbox = async (section, option) => {
  const filterBlock = await findBlock(section);
  return within(filterBlock).findByLabelText(option);
};

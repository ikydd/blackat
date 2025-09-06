// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from '@testing-library/react';

export const sortBy = async (value) => {
  const sort = await screen.findByRole('combobox');
  fireEvent.change(sort, { target: { value } });
};

export const setSide = async (side) => fireEvent.click(screen.getByText(side));

export const clickFilter = async (section) => {
  const button = await screen.findByRole('button', {
    name: new RegExp(`${section}`)
  });
  fireEvent.click(button);
};

export const clickOption = async (name) => {
  const checkbox = await screen.findByRole('checkbox', { name });
  fireEvent.click(checkbox);
  return checkbox;
};

export const filterBy = async (section, ...filters) => {
  await clickFilter(section);

  return Promise.all(filters.map(clickOption));
};

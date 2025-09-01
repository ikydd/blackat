// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from '@testing-library/react';

export const sortBy = async (value) => {
  const sort = await screen.findByRole('combobox');
  fireEvent.change(sort, { target: { value } });
};

export const setSide = async (side) => fireEvent.click(screen.getByText(side));

export const openFilter = async (section) => {
  const prefsButton = await screen.findByText(section);
  fireEvent.click(prefsButton);
};

export const setFilter = async (section, ...filters) => {
  await openFilter(section);

  return Promise.all(
    filters.map(async (text) => {
      const checkbox = await screen.findByLabelText(text);
      fireEvent.click(checkbox);
      return checkbox;
    })
  );
};

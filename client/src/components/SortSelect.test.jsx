import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SortSelect from "./SortSelect";

const testOptions = [
  {
    title: "Pack",
    value: "pack",
  },
  {
    title: "Type",
    value: "type",
  },
];

describe("SortSelect", () => {
  it("renders without crashing", () => {
    render(<SortSelect />);
  });

  it("contains a select dropdown field", () => {
    const { getByRole } = render(<SortSelect />);

    expect(getByRole("combobox")).toBeTruthy();
  });

  it("uses the provided options", () => {
    const { getAllByRole } = render(<SortSelect options={testOptions} />);

    expect(getAllByRole("option")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          textContent: "Sort by Pack",
          value: "pack",
        }),
        expect.objectContaining({
          textContent: "Sort by Type",
          value: "type",
        }),
      ])
    );
  });

  it("respsects the provided default", () => {
    const { getByRole } = render(
      <SortSelect options={testOptions} default="type" />
    );

    expect(getByRole("combobox").value).toEqual("type");
  });

  it("calls a callback on change", async () => {
    const cb = jest.fn();
    const { getByRole } = render(
      <SortSelect options={testOptions} onChange={cb} />
    );
    const input = getByRole("combobox");

    fireEvent.change(input, { currentTarget: { value: "pack" } });
    expect(cb).toHaveBeenCalledWith("pack");
  });
});

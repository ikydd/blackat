import React from "react";
import { render, fireEvent } from "@testing-library/react";
import NestedFilterList from "./NestedFilterList";

const options = require("../../../fixtures/api/foo-nested");
const optionsSelected = require("../../../fixtures/api/foo-nested-selected");

const countCheckboxes = (options) =>
  options.reduce(
    (total, group) =>
      (group.items.length > 1 ? total + group.items.length : total) + 1,
    0
  );

describe("NestedFilterList", () => {
  it("renders without crashing", () => {
    render(<NestedFilterList options={options} />);
  });

  it("has defaults to an obvious error title", () => {
    const { getByRole } = render(<NestedFilterList options={options} />);

    expect(getByRole("heading")).toHaveTextContent("Missing");
  });

  it("accepts and uses a title", () => {
    const { getByRole } = render(
      <NestedFilterList options={options} title="Foo" />
    );

    expect(getByRole("heading")).toHaveTextContent("Foo");
  });

  describe("Options", () => {
    it("shows provided grouped options with grouping", async () => {
      const groupOptions = require("../../../fixtures/api/foo-nested-group");

      const { findAllByRole } = render(
        <NestedFilterList options={groupOptions} />
      );
      const checkboxes = await findAllByRole("checkbox");

      const expected = countCheckboxes(groupOptions);

      expect(checkboxes).toHaveLength(expected);
    });

    it("does not show subitems for groups with only one item", async () => {
      const singleOptions = require("../../../fixtures/api/foo-nested-single");

      const { findAllByRole } = render(
        <NestedFilterList options={singleOptions} />
      );
      const checkboxes = await findAllByRole("checkbox");

      const expected = countCheckboxes(singleOptions);

      expect(checkboxes).toHaveLength(expected);
    });

    it("shows correct filters as selected", async () => {
      const { findAllByRole } = render(
        <NestedFilterList options={optionsSelected} />
      );
      const checkboxes = await findAllByRole("checkbox");

      const checked = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute("value"));

      expect(checked).toEqual(["bar", "alpha", "beta", "gamma"]);
    });

    it("calls the callback when the group is checked", async () => {
      const groupCb = jest.fn();
      const { findByLabelText } = render(
        <NestedFilterList options={options} onGroupChange={groupCb} />
      );
      const group = await findByLabelText("Bar");
      fireEvent.click(group);

      expect(groupCb).toHaveBeenCalled();
    });

    it("calls the callback when the group is unchecked", async () => {
      const groupCb = jest.fn();
      const { findByLabelText } = render(
        <NestedFilterList options={optionsSelected} onGroupChange={groupCb} />
      );
      const group = await findByLabelText("Bar");
      fireEvent.click(group);

      expect(groupCb).toHaveBeenCalled();
    });

    it("calls the callback when an item is checked", async () => {
      const cb = jest.fn();
      const { findByLabelText } = render(
        <NestedFilterList options={options} onSubitemChange={cb} />
      );
      const group = await findByLabelText("Alpha");
      fireEvent.click(group);

      expect(cb).toHaveBeenCalled();
    });
  });

  describe("visibility toggle", () => {
    it("shows options by default", async () => {
      const { findAllByRole } = render(<NestedFilterList options={options} />);
      const checkboxes = await findAllByRole("checkbox");

      const expectedLength = countCheckboxes(options);

      expect(checkboxes).toHaveLength(expectedLength);
    });

    it("can be configured to hide filters via a prop", async () => {
      const { queryAllByRole } = render(
        <NestedFilterList options={options} hidden={true} />
      );
      const checkboxes = await queryAllByRole("checkbox");

      expect(checkboxes).toHaveLength(0);
    });

    it("shows options when hidden and heading is clicked", async () => {
      const { findAllByRole, getByRole } = render(
        <NestedFilterList options={options} hidden={true} />
      );
      fireEvent.click(getByRole("heading"));
      const checkboxes = await findAllByRole("checkbox");

      const expectedLength = countCheckboxes(options);

      expect(checkboxes).toHaveLength(expectedLength);
    });

    it("hides options when showing and heading is clicked", async () => {
      const { queryAllByRole, getByRole } = render(
        <NestedFilterList options={options} />
      );
      fireEvent.click(getByRole("heading"));
      const checkboxes = await queryAllByRole("checkbox");

      expect(checkboxes).toHaveLength(0);
    });

    it("retains selections when collapsed", async () => {
      const { queryAllByRole, getByRole } = render(
        <NestedFilterList options={optionsSelected} />
      );
      fireEvent.click(getByRole("heading"));
      fireEvent.click(getByRole("heading"));

      const checkboxes = await queryAllByRole("checkbox");

      const checked = checkboxes
        .filter(({ checked }) => checked)
        .map((input) => input.getAttribute("value"));

      expect(checked).toEqual(["bar", "alpha", "beta", "gamma"]);
    });
  });

  describe("Clear All", () => {
    it("has a button", async () => {
      const { getByRole } = render(<NestedFilterList options={options} />);

      expect(getByRole("button")).toBeTruthy();
    });

    it("removes all selected filters", async () => {
      const cb = jest.fn();
      const { getByRole } = render(
        <NestedFilterList options={options} clearAll={cb} />
      );
      fireEvent.click(getByRole("button"));

      expect(cb).toHaveBeenCalled();
    });
  });

  describe("active notifier", () => {
    it("has no visual mark when no filters are selected", async () => {
      const { queryByRole, findAllByRole } = render(
        <NestedFilterList options={options} />
      );
      await findAllByRole("checkbox");

      const alert = queryByRole("alert");

      expect(alert).toBeFalsy();
    });

    it("has a visual mark when one or more filters are selected", async () => {
      const { findByRole } = render(
        <NestedFilterList options={optionsSelected} />
      );
      const alert = await findByRole("alert");

      expect(alert).toBeTruthy();
    });
  });
});

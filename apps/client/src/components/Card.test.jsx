import React from "react";
import { render } from "@testing-library/react";
import cardData from "@repo/testing-fixtures/api/cards.json";
import Card from "./Card";

const data = cardData[0];

describe("Card", () => {
  it("renders without crashing", () => {
    expect(() => render(<Card data={data} />)).not.toThrow();
  });

  it("has an img using the card code", async () => {
    const { getByRole } = render(<Card data={data} />);
    const img = getByRole("img");

    expect(img).toHaveAttribute("src", data.imagesrc);
  });

  it("has a title", () => {
    const { container } = render(<Card data={data} />);

    expect(container.firstChild).toHaveAttribute("title", data.title);
  });

  it("has the class card-tile", () => {
    const { container } = render(<Card data={data} />);

    expect(container.firstChild).toHaveClass("card-tile");
  });
});

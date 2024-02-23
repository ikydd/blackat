import React from "react";
import Card from "./Card";
import { render } from "@testing-library/react";

describe("Card", () => {
  const data = require("../../../fixtures/api/cards")[0];

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

  it("is hidden when data.show is false", () => {
    const card = Object.assign({ show: false }, data);
    const { container } = render(<Card data={card} />);

    expect(container.firstChild).toHaveClass("card-tile");
  });
});

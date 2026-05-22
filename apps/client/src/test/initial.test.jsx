import React from "react";
import { render } from "@testing-library/react";
import cards from "@repo/testing-fixtures/api/cards.json";
import App from "../App";
import { findImageTitles } from "./helpers/finders";

jest.mock("../helpers/api");

const getCardsFromSide = (requestedSide) =>
  cards.filter(({ side }) => side === requestedSide).map(({ title }) => title);

describe("Initial page", () => {
  it("loads the cards by default", async () => {
    render(<App />);
    const all = await findImageTitles("img");

    expect(all).toEqual(getCardsFromSide("runner"));
  });
});

import React from "react";

const FilterNotifier = ({ on }) => {
  return on ? <span role="alert">&bull;</span> : "";
};

export default FilterNotifier;

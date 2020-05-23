import React from "react";
const Options = () =>
  Array.from(new Array(30), (val, index) => index + 1).map((number) => (
    <option key={number}>{number}</option>
  ));

export default Options;

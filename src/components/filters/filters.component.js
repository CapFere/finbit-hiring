import React from "react";

import Options from "../options/options.component";

const Filters = ({
  selectedCountries,
  dates,
  handleChange,
  handleDateChange,
}) => (
  <>
    <div>
      <h4>Countries</h4>
      <input
        type="checkbox"
        name="China"
        checked={selectedCountries.China}
        onChange={handleChange}
      />
      <label>China</label>
      <input
        type="checkbox"
        name="Italy"
        checked={selectedCountries.Italy}
        onChange={handleChange}
      />
      <label>Italy</label>
      <input
        type="checkbox"
        name="USA"
        checked={selectedCountries.USA}
        onChange={handleChange}
      />
      <label>USA</label>
      <input
        type="checkbox"
        name="Spain"
        checked={selectedCountries.Spain}
        onChange={handleChange}
      />
      <label>Spain</label>
    </div>
    <div>
      <h4>Duration</h4>
      <label>Start Date</label>
      <select value={dates.start} name="start" onChange={handleDateChange}>
        <Options />
      </select>
      <label>End Date</label>
      <select value={dates.end} name="end" onChange={handleDateChange}>
        <Options />}
      </select>
    </div>
  </>
);

export default Filters;

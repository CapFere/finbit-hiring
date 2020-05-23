import React, { useState, useEffect } from "react";
import LineChart from "./core/LineChart";
import PieChart from "./core/PieChart";
import "./style.css";

const App = (props) => {
  // Your code goes here
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(true);
  const [selectedCountries, setSelectedCoutries] = useState({
    China: false,
    Italy: false,
    USA: false,
    Spain: false,
  });
  const [dates, setDates] = useState({
    start: 1,
    end: 30,
  });
  useEffect(() => {
    setLoading(true);
    fetch("http://my-json-server.typicode.com/yisehak-awm/finbit-hiring/result")
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setData(result);
        setLoading(false);
      })
      .catch((error) => console.log("ERROR", error));
  }, []);
  const handleChange = (event) => {
    setSelectedCoutries({
      ...selectedCountries,
      [event.target.name]: !selectedCountries[event.target.name],
    });
  };
  const handleDateChange = (event) => {
    setDates({
      ...dates,
      [event.target.name]: event.target.value,
    });
  };
  const renderOptions = () =>
    Array.from(new Array(30), (val, index) => index + 1).map((number) => (
      <option key={number}>{number}</option>
    ));
  const calculateLineCharData = () => {
    const lineData = [];
    for (const index in data) {
      if (selectedCountries[data[index].country]) {
        let country = {
          id: data[index].country,
          data: [],
        };
        for (const record of data[index].records) {
          if (record.day >= dates.start && record.day <= dates.end) {
            country.data.push({
              x: record.day,
              y: record.new,
            });
          }
        }

        lineData.push(country);
      }
    }
    return lineData;
  };
  const calculatePieCharData = () => {
    let totalCase = 0;
    let totalRecovery = 0;
    let totalDeath = 0;
    let maxCountry = "";
    for (const index in data) {
      if (selectedCountries[data[index].country]) {
        let currentTotalCase = 0;
        let currentTotalRecovery = 0;
        let currentTotalDeath = 0;
        for (const record of data[index].records) {
          if (record.day >= dates.start && record.day <= dates.end) {
            currentTotalCase += record.new;
            currentTotalRecovery += record.recovered;
            currentTotalDeath += record.death;
          }
        }

        const diff = currentTotalCase - currentTotalRecovery;
        if (diff > totalCase - totalRecovery) {
          totalCase = currentTotalCase;
          totalDeath = currentTotalDeath;
          totalRecovery = currentTotalRecovery;
          maxCountry = data[index].country;
        }
      }
    }
    const pidData = [
      {
        id: "new",
        label: "New Case",
        value: totalCase,
      },
      {
        id: "death",
        label: "Deaths",
        value: totalDeath,
      },
      {
        id: "recovery",
        label: "Recoveries",
        value: totalRecovery,
      },
    ];

    return { maxCountry, pidData };
  };
  const isNoData = () =>
    selectedCountries.China ||
    selectedCountries.USA ||
    selectedCountries.Spain ||
    selectedCountries.Italy;
  const { maxCountry, pidData } = calculatePieCharData();

  return (
    <div>
      <h2>Data Has been loaded! Use filter bellow to display it</h2>
      <form>
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
            {renderOptions()}
          </select>
          <label>End Date</label>
          <select value={dates.end} name="end" onChange={handleDateChange}>
            {renderOptions()}
          </select>
        </div>
      </form>
      {loading ? (
        <h2>Loading....</h2>
      ) : isNoData() ? (
        <div>
          <div>
            <LineChart data={calculateLineCharData()} />
          </div>
          <h3>Most Affected Country</h3>
          <p>Country Name: {maxCountry}</p>
          <PieChart data={pidData} />
        </div>
      ) : (
        <h2>No Data</h2>
      )}
    </div>
  );
};

export default App;

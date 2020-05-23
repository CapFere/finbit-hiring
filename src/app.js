import React, { useState, useEffect } from "react";
import LineChart from "./core/LineChart";
import PieChart from "./core/PieChart";

import Filters from "./components/filters/filters.component";
import "./style.css";

const App = (props) => {
  // Your code goes here
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
        <Filters
          selectedCountries={selectedCountries}
          dates={dates}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
        />
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

import React, { useEffect, useState } from "react";
import "../style/AggressiveEvents.css";

const config = require("../config.json");

const AggressiveEvents = () => {
  const [parsedData, setParsedData] = useState([]);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/aggravated-stats`)
      .then((response) => response.json())
      .then((data) => {
        setParsedData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div className="aggressive-events">
      {parsedData && parsedData.length > 0 && (
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                {Object.keys(parsedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedData.map((item, index) => (
                <tr className="aggressive-event-row" key={index}>
                  {Object.keys(item).map((key) => (
                    <td key={key}>{item[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AggressiveEvents;

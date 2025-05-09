import React, { useEffect, useState } from "react";
import "../style/AggressiveEvents.css";
import config from "../config";

const AggressiveEvents = () => {
  const [parsedData, setParsedData] = useState([]);
  useEffect(() => {
    fetch(`${config.host}/aggravated-stats`)
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
                {Object.keys(parsedData[0]).map(
                  (
                    key //general table used from TeamsPage
                  ) => (
                    <th key={key}>{key}</th>
                  )
                )}
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

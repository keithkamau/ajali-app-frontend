import "./AnalyticsChart.css";
import React from "react";
function AnalyticsChart({ data, title }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="analytics-chart">
      <div className="analytics-chart-header">
        <h3>{title}</h3>
      </div>

      <div className="bar-chart">
        {data.map((item) => (
          <div className="bar-item" key={item.label}>
            <div className="bar-value">
              {item.value}
            </div>

            <div className="bar-wrapper">
              <div
                className="bar"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                }}
              ></div>
            </div>

            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsChart;
// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getWorkshopStats } from "../services/api";
import StatsCard from "./StatsCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const year = selectedYear.getFullYear();

  // Format financial year as "2024-2025"
  const formatFinancialYear = (date) => {
    const year = date.getFullYear();
    return `${year}-${year + 1}`;
  };

  const CustomInput = ({ value, onClick }) => (
    <button className="custom-year-input" onClick={onClick}>
      {formatFinancialYear(selectedYear)}
    </button>
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getWorkshopStats(year);
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [year]);

  const handleYearChange = (date) => {
    setSelectedYear(date);
  };

  return (
    <div className="dashboard">
      <div className="heading">
        <h1>NIELIT Workshop Management System</h1>
      <div className="dashboard-description">
        Leader in the development of industry oriented quality education and
        training and be the country's premier Institution for examination and
        certification in the field of Information, Electronics and
        Communications Technology (IECT).
      </div>
      </div>
      

      <div className="year-selector">
        <label htmlFor="year">Financial Year:</label>
        <DatePicker
          selected={selectedYear}
          onChange={handleYearChange}
          showYearPicker
          dateFormat="yyyy"
          className="year-picker"
          customInput={<CustomInput />}
          renderCustomHeader={({
            date,
            changeYear,
            decreaseYear,
            increaseYear,
            prevYearButtonDisabled,
            nextYearButtonDisabled,
          }) => (
            <div className="custom-header">
              <button
                onClick={decreaseYear}
                disabled={prevYearButtonDisabled}
              >
                {"<"}
              </button>
              <span>{formatFinancialYear(date)}</span>
              <button
                onClick={increaseYear}
                disabled={nextYearButtonDisabled}
              >
                {">"}
              </button>
            </div>
          )}
        />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Workshops: "
              value={stats.total_workshops}
              icon="📊"
            />
            <StatsCard
              title="Total Participants: "
              value={stats.total_participants}
              icon="👥"
            />
          </div>
          <div className="financial-range">
            From 1st April {year} to 31st March {year + 1}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

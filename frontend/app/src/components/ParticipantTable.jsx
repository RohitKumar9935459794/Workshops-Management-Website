import React, { useEffect, useState } from 'react';
import { getParticipantsReports, getWorkshopFilters, downloadParticipantReports } from '../services/api';
import './ParticipantTable.css';
import StatsCard from './StatsCard';

const ParticipantTable = () => {
  const [participants, setParticipants] = useState([]);
  const [filters, setFilters] = useState({ page: 1 });
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState('excel'); // default format
  const [totalParticipants, setTotalParticipants] = useState(0);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await getWorkshopFilters();
        setFilterOptions(data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const data = await getParticipantsReports(filters);
        setParticipants(data?.data?.participants || []);
        setPagination(data?.data?.pagination || {});
        setTotalParticipants(data?.data?.total_participants || 0);
      console.log("Fetched participants:", data?.data?.participants);

      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [filters]);

  const handleFilterChange = (e, field) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      [field]: value === 'All' ? undefined : value,
      page: 1
    }));
  };

    const handleDateChange = (e, field) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
      page: 1
    }));
  };

  const handleNextPage = () => {
    if (pagination.has_next_page) {
      setFilters(prev => ({ ...prev, page: pagination.current_page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.has_prev_page) {
      setFilters(prev => ({ ...prev, page: pagination.current_page - 1 }));
    }
  };

  return (
    <div className="participant-table-container">
    <div className="header-controls">
      <div className="download-controls">
      <select
        value={downloadFormat}
        onChange={(e) => setDownloadFormat(e.target.value)}
        className="format-selector">
        <option value="excel">Excel</option>
        <option value="pdf">PDF</option>
    </select>
      <button onClick={() => downloadParticipantReports(filters, downloadFormat)} className="download-button">
          Download Report
      </button>
    </div>

    <div >
      <div >
        <StatsCard title="Total Participants:" value={totalParticipants} loading={loading} />
      </div>
    </div>

    </div>
      <div className="filters">
        <select onChange={(e) => handleFilterChange(e, 'subject')} value={filters.subject || 'All'}>
          <option value="All">All Subjects</option>
          {filterOptions.subjects?.map((sub, i) => (
            <option key={i} value={sub}>{sub}</option>
          ))}
        </select>

        <input
          type="date"
          onChange={(e) => handleDateChange(e, 'from_date')}
          value={filters.from_date || ''}
          placeholder="From Date"
        />

        <input
          type="date"
          onChange={(e) => handleDateChange(e, 'till_date')}
          value={filters.till_date || ''}
          placeholder="Till Date"
        />

        <select onChange={(e) => handleFilterChange(e, 'technology')} value={filters.technology || 'All'}>
          <option value="All">All Technologies</option>
          {filterOptions.technologies?.map((tech, i) => (
            <option key={i} value={tech}>{tech}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'project')} value={filters.project || 'All'}>
          <option value="All">All Projects</option>
          {filterOptions.projects?.map((proj, i) => (
            <option key={i} value={proj}>{proj}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'centre')} value={filters.centre || 'All'}>
          <option value="All">All Centres</option>
          {filterOptions.centres?.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'mode')} value={filters.mode || 'All'}>
          <option value="All">All Modes</option>
          {filterOptions.modes?.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'speaker')} value={filters.speaker || 'All'}>
          <option value="All">All Speakers</option>
          {filterOptions.speakers?.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading participants...</div>
      ) : (
        <table className="participant-table">
          <thead>
            <tr>
              <th>Participant Name</th>
              <th>Fathers Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Highest Qualifications</th>
              <th>Working</th>
              <th>Designation</th>
              <th>Department</th>
              <th>College Name</th>
              <th>Degree</th>
              <th>Workshop ID</th>
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((p) => (
                <tr key={p.REGID}>
                  <td>{p.Name}</td>
                  <td>{p.FATHERS_NAME}</td>
                  <td>{p.Email}</td>
                  <td>{p.MobileNo}</td>
                  <td>{p.HighestQualifications}</td>
                  <td>{p.Working}</td>
                  <td>{p.Designation}</td>
                  <td>{p.Department}</td>
                  <td>{p.CollegeName}</td>
                  <td>{p.Degree}</td>
                  <td>{p.workshop_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">No participants found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={!pagination.has_prev_page} className="pagination-button">
          Previous
        </button>
        <span>
          Page {pagination.current_page || 1} of {pagination.total_pages || 1}
        </span>
        <button onClick={handleNextPage} disabled={!pagination.has_next_page} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default ParticipantTable;

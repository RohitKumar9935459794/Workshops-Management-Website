import React, { useEffect, useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getParticipantswithId } from '../services/api';
import './ParticipantTable.css';
import StatsCard from './StatsCard';

const WorkshopParticipant = () => {
  const { workshop_id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const location = useLocation();
  const { subject, from, till, centre, speaker } = location.state || {};


  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
  });

  const [filters, setFilters] = useState({
    workshop_id: workshop_id,
  });
  const [page, setPage] = useState(1);


  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const data = await getParticipantswithId(filters.workshop_id, page);
        setParticipants(data?.data?.participants || []);
        setPagination(data?.data?.pagination || {});
        setTotalParticipants(data?.data?.pagination?.total_items || 0);
        console.log("Fetched participants:", data?.data?.participants);

      }
      catch(error){
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [filters.workshop_id, page]);

 const handleNextPage = () => {
  if (pagination.has_next_page) {
    setPage(prev => prev + 1);
  }
};

const handlePrevPage = () => {
  if (pagination.has_prev_page) {
    setPage(prev => prev - 1);
  }
};

  return (
    <div className="participant-table-container">
      
      <div className="headerline">
        <div className="stats-wrapper">
        <div className="stats-card-container">
          <StatsCard title={`Participants in ${subject} with ID: ${workshop_id} held from ${from} to ${till} at ${centre} Centre taken by ${speaker}:`} value={totalParticipants} loading={loading} />
        </div>
      </div>
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
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((p) => (
                <tr key={p.regid}>
                  <td>{p.name}</td>
                  <td>{p.fathers_name}</td>
                  <td>{p.email}</td>
                  <td>{p.mobileNo}</td>
                  <td>{p.Highestqualifications}</td>
                  <td>{p.working}</td>
                  <td>{p.designation}</td>
                  <td>{p.department}</td>
                  <td>{p.collegename}</td>
                  <td>{p.degree}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">No participants found</td>
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

export default WorkshopParticipant;

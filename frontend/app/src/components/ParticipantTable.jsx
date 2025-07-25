// import React, { useEffect, useState } from 'react';
// import { getParticipantsReports, getWorkshopFilters, downloadParticipantReports } from '../services/api';
// import './ParticipantTable.css';
// import StatsCard from './StatsCard';

// const ParticipantTable = () => {
//   const [participants, setParticipants] = useState([]);
//   const [filters, setFilters] = useState({ page: 1 });
//   const [filterOptions, setFilterOptions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [downloadFormat, setDownloadFormat] = useState('excel'); // default format
//   const [totalParticipants, setTotalParticipants] = useState(0);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     total_pages: 1,
//     has_next_page: false,
//     has_prev_page: false
//   });

//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const data = await getWorkshopFilters();
//         setFilterOptions(data);
//       } catch (error) {
//         console.error('Error fetching filter options:', error);
//       }
//     };
//     fetchFilters();
//   }, []);

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       setLoading(true);
//       try {
//         const data = await getParticipantsReports(filters);
//         setParticipants(data?.data?.participants || []);
//         setPagination(data?.data?.pagination || {});
//         setTotalParticipants(data?.data?.total_participants || 0);
//       console.log("Fetched participants:", data?.data?.participants);

//       } catch (error) {
//         console.error('Error fetching participants:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchParticipants();
//   }, [filters]);

//   const handleFilterChange = (e, field) => {
//     const value = e.target.value;
//     setFilters(prev => ({
//       ...prev,
//       [field]: value === 'All' ? undefined : value,
//       page: 1
//     }));
//   };

//     const handleDateChange = (e, field) => {
//     const value = e.target.value;
//     setFilters(prev => ({
//       ...prev,
//       [field]: value || undefined,
//       page: 1
//     }));
//   };

//   const handleUpdateParticipant = async (updatedData) => {
//     setUpdateLoading(true);
//     try {
//       await updateParticipant(updatedData);
//       setUpdateSuccess(true);
      
//       // Refresh the participants list
//       const data = await getParticipantsReports(filters);
//       setParticipants(data?.data?.participants || []);
      
//       setTimeout(() => setUpdateSuccess(false), 3000);
//     } catch (error) {
//       console.error('Error updating participant:', error);
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

  

//   const handleNextPage = () => {
//     if (pagination.has_next_page) {
//       setFilters(prev => ({ ...prev, page: pagination.current_page + 1 }));
//     }
//   };

//   const handlePrevPage = () => {
//     if (pagination.has_prev_page) {
//       setFilters(prev => ({ ...prev, page: pagination.current_page - 1 }));
//     }
//   };

  

//   return (
//     <div className="participant-table-container">
//     <div className="header-controls">
//       <div className="download-controls">
//       <select
//         value={downloadFormat}
//         onChange={(e) => setDownloadFormat(e.target.value)}
//         className="format-selector">
//         <option value="excel">Excel</option>
//         <option value="pdf">PDF</option>
//     </select>
//       <button onClick={() => downloadParticipantReports(filters, downloadFormat)} className="download-button">
//           Download Report
//       </button>
//     </div>

//     <div >
//       <div >
//         <StatsCard title="Total Participants:" value={totalParticipants} loading={loading} />
//       </div>
//     </div>

//     </div>
//       <div className="filters">
//         <select onChange={(e) => handleFilterChange(e, 'subject')} value={filters.subject || 'All'}>
//           <option value="All">All Subjects</option>
//           {filterOptions.subjects?.map((sub, i) => (
//             <option key={i} value={sub}>{sub}</option>
//           ))}
//         </select>

//         <input
//           type="date"
//           onChange={(e) => handleDateChange(e, 'from_date')}
//           value={filters.from_date || ''}
//           placeholder="From Date"
//         />

//         <input
//           type="date"
//           onChange={(e) => handleDateChange(e, 'till_date')}
//           value={filters.till_date || ''}
//           placeholder="Till Date"
//         />

//         <select onChange={(e) => handleFilterChange(e, 'technology')} value={filters.technology || 'All'}>
//           <option value="All">All Technologies</option>
//           {filterOptions.technologies?.map((tech, i) => (
//             <option key={i} value={tech}>{tech}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'project')} value={filters.project || 'All'}>
//           <option value="All">All Projects</option>
//           {filterOptions.projects?.map((proj, i) => (
//             <option key={i} value={proj}>{proj}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'centre')} value={filters.centre || 'All'}>
//           <option value="All">All Centres</option>
//           {filterOptions.centres?.map((c, i) => (
//             <option key={i} value={c}>{c}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'mode')} value={filters.mode || 'All'}>
//           <option value="All">All Modes</option>
//           {filterOptions.modes?.map((m, i) => (
//             <option key={i} value={m}>{m}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'speaker')} value={filters.speaker || 'All'}>
//           <option value="All">All Speakers</option>
//           {filterOptions.speakers?.map((s, i) => (
//             <option key={i} value={s}>{s}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="loading">Loading participants...</div>
//       ) : (
//         <table className="participant-table">
//           <thead>
//             <tr>
//               <th>Participant Name</th>
//               <th>Fathers Name</th>
//               <th>Email</th>
//               <th>Mobile Number</th>
//               <th>Highest Qualifications</th>
//               <th>Working</th>
//               <th>Designation</th>
//               <th>Department</th>
//               <th>College Name</th>
//               <th>Degree</th>
//               <th>Workshop ID</th>
//             </tr>
//           </thead>
//           <tbody>
//             {participants.length > 0 ? (
//               participants.map((p) => (
//                 <tr key={p.REGID}>
//                   <td>{p.Name}</td>
//                   <td>{p.FATHERS_NAME}</td>
//                   <td>{p.Email}</td>
//                   <td>{p.MobileNo}</td>
//                   <td>{p.HighestQualifications}</td>
//                   <td>{p.Working}</td>
//                   <td>{p.Designation}</td>
//                   <td>{p.Department}</td>
//                   <td>{p.CollegeName}</td>
//                   <td>{p.Degree}</td>
//                   <td>{p.workshop_id}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="no-results">No participants found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}

//       <div className="pagination-controls">
//         <button onClick={handlePrevPage} disabled={!pagination.has_prev_page} className="pagination-button">
//           Previous
//         </button>
//         <span>
//           Page {pagination.current_page || 1} of {pagination.total_pages || 1}
//         </span>
//         <button onClick={handleNextPage} disabled={!pagination.has_next_page} className="pagination-button">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ParticipantTable;

import React, { useEffect, useState } from 'react';
import { getParticipantsReports, getWorkshopFilters, downloadParticipantReports, updateParticipant } from '../services/api';
import './ParticipantTable.css';
import StatsCard from './StatsCard';

const ParticipantTable = () => {
  const [participants, setParticipants] = useState([]);
  const [filters, setFilters] = useState({ page: 1 });
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState('excel');
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

  // const handleUpdateParticipant = async (updatedData) => {
  //   setUpdateLoading(true);
  //   try {
  //     await updateParticipant(updatedData);
  //     setUpdateSuccess(true);
      
  //     // Refresh the participants list
  //     const data = await getParticipantsReports(filters);
  //     setParticipants(data?.data?.participants || []);
      
  //     setTimeout(() => setUpdateSuccess(false), 3000);
  //   } catch (error) {
  //     console.error('Error updating participant:', error);
  //   } finally {
  //     setUpdateLoading(false);
  //   }
  // };

  const handleUpdateParticipant = async (updatedData) => {
  setUpdateLoading(true);
  try {
    await updateParticipant(updatedData, { workshop_id: updatedData.workshop_id }); // ✅ FIXED
    setUpdateSuccess(true);

    const data = await getParticipantsReports(filters);
    setParticipants(data?.data?.participants || []);

    setTimeout(() => setUpdateSuccess(false), 3000);
  } catch (error) {
    console.error('Error updating participant:', error);
  } finally {
    setUpdateLoading(false);
  }
};


  const UpdateParticipantModal = ({ participant, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      REGID: participant?.REGID || '',
      Name: participant?.Name || '',
      FATHERS_NAME: participant?.FATHERS_NAME || '',
      Email: participant?.Email || '',
      MobileNo: participant?.MobileNo || '',
      HighestQualifications: participant?.HighestQualifications || '',
      Working: participant?.Working || '',
      Designation: participant?.Designation || '',
      Department: participant?.Department || '',
      CollegeName: participant?.CollegeName || '',
      Degree: participant?.Degree || '',
      workshop_id: participant?.workshop_id || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await onUpdate(formData);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Update Participant {participant.REGID}</h2>
          {updateSuccess && <div className="success-message">Participant updated successfully!</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Father's Name:</label>
              <input
                name="FATHERS_NAME"
                value={formData.FATHERS_NAME}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Number:</label>
              <input
                name="MobileNo"
                value={formData.MobileNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Highest Qualifications:</label>
              <input
                name="HighestQualifications"
                value={formData.HighestQualifications}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Working:</label>
              <select
                name="Working"
                value={formData.Working}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Designation:</label>
              <input
                name="Designation"
                value={formData.Designation}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Department:</label>
              <input
                name="Department"
                value={formData.Department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>College Name:</label>
              <input
                name="CollegeName"
                value={formData.CollegeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Degree:</label>
              <input
                name="Degree"
                value={formData.Degree}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Workshop ID:</label>
              <input
                name="workshop_id"
                value={formData.workshop_id}
                onChange={handleChange}
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                onClick={onClose}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="update-button"
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Participant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="participant-table-container">
      <div className="header-controls">
        <div className="download-controls">
          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
            className="format-selector"
          >
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <button 
            onClick={() => downloadParticipantReports(filters, downloadFormat)} 
            className="download-button"
          >
            Download Report
          </button>
        </div>
        <div>
          <div>
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
              <th>Update</th>
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
                  <td>
                    <button
                      className="update-participant-button"
                      onClick={() => {
                        setSelectedParticipant(p);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="no-results">No participants found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination-controls">
        <button
          onClick={handlePrevPage}
          disabled={!pagination.has_prev_page}
          className="pagination-button"
        >
          Previous
        </button>
        <span>Page {pagination.current_page} of {pagination.total_pages}</span>
        <button
          onClick={handleNextPage}
          disabled={!pagination.has_next_page}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {showUpdateModal && (
        <UpdateParticipantModal
          participant={selectedParticipant}
          onClose={() => {
            setShowUpdateModal(false);
            setUpdateSuccess(false);
          }}
          onUpdate={handleUpdateParticipant}
        />
      )}
    </div>
  );
};

export default ParticipantTable;
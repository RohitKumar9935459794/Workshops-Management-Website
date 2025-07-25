// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { getWorkshops, getWorkshopFilters, downloadWorkshopReports } from '../services/api';
// import StatsCard from './StatsCard';

// import './Workshops.css';
 
// const WorkshopTable = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [workshops, setWorkshops] = useState([]);
//   const [filters, setFilters] = useState({page: 1 });
//   const [filterOptions, setFilterOptions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [downloadFormat, setDownloadFormat] = useState('excel'); // default format
//   const [totalWorkshops, setTotalWorkshops] = useState(0);
//   const [totalParticipants, setTotalParticipants] = useState(0);
  
 

//   // Fetch filter options on mount
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

//   // state for pagination
// const [pagination, setPagination] = useState({
//   current_page: 1,
//   total_pages: 1,
//   has_next_page: false,
//   has_prev_page: false
// });

//   // Fetch workshops whenever filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const workshopData = await getWorkshops(filters);
//         setWorkshops(workshopData?.data?.workshops || []);
//         setPagination(workshopData?.data?.pagination || {});
//         setTotalWorkshops(workshopData?.data?.pagination.total_items || 0);
//       } catch (error) {
//         console.error('Error fetching workshops:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (e, field) => {
//     const value = e.target.value;
//     setFilters(prev => ({
//       ...prev,
//       [field]: value === 'All' ? undefined : value,
//       page: 1
//     }));
//   };

//   const handleDateChange = (e, field) => {
//     const value = e.target.value;
//     setFilters(prev => ({
//       ...prev,
//       [field]: value || undefined,
//       page: 1
//     }));
//   };

//   const handleNextPage = () => {
//   if (pagination.has_next_page) {
//     setFilters(prev => ({
//       ...prev,
//       page: pagination.current_page + 1
//     }));
//   }
// };

// const handlePrevPage = () => {
//   if (pagination.has_prev_page) {
//     setFilters(prev => ({
//       ...prev,
//       page: pagination.current_page - 1
//     }));
//   }
// };

//   return (
//     <div className="workshop-table-container">
      

//     <div className="header-controls">
//       <div className="download-controls">
//         <select
//           value={downloadFormat}
//           onChange={(e) => setDownloadFormat(e.target.value)}
//           className="format-selector"
//         >
//           <option value="excel">Excel</option>
//           <option value="pdf">PDF</option>
//         </select>
//         <button onClick={() => downloadWorkshopReports(filters, downloadFormat)} className="download-button">
//           Download Report
//         </button>
//       </div>
//       <div >
//         <div >
//           <StatsCard title="Total Workshops:" value={totalWorkshops} loading={loading} />
//         </div>
//         <div >
//         <StatsCard title="Total Participants:" value={totalParticipants} loading={loading} />
//       </div>
//       </div>
//     </div>

//       <div className="filters">
//       <small className="note">Workshops are shown in order of Date they started.</small><br/>
//         <select onChange={(e) => handleFilterChange(e, 'subject')} value={filters.subject || 'All'}>
//           <option value = 'All'>All Subjects</option>
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
//           <option value = 'All'>All Technologies</option>
//           {filterOptions.technologies?.map((tech, i) => (
//             <option key={i} value={tech}>{tech}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'project')} value={filters.project || 'All'}>
//           <option value = 'All'>All Projects</option>
//           {filterOptions.projects?.map((proj, i) => (
//             <option key={i} value={proj}>{proj}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'centre')} value={filters.centre || 'All'}>
//           <option value = 'All'>All Centres</option>
//           {filterOptions.centres?.map((c, i) => (
//             <option key={i} value={c}>{c}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'mode')} value={filters.mode || 'All'}>
//           <option value = 'All'>All Modes</option>
//           {filterOptions.modes?.map((m, i) => (
//             <option key={i} value={m}>{m}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'speaker')} value={filters.speaker || 'All'}>
//           <option value = 'All'>All Speakers</option>
//           {filterOptions.speakers?.map((s, i) => (
//             <option key={i} value={s}>{s}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="loading">Loading workshops...</div>
//       ) : (
//         <table className="workshop-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Subject </th>
//               <th>From Date</th>
//               <th>Till Date</th>
//               <th>Technology</th>
//               <th>Project</th>
//               <th>Duration</th>
//               <th>Centre</th>
//               <th>Mode</th>
//               <th>Speaker</th>
//               <th>Participants</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {workshops.length > 0 ? (
//               workshops.map(w => (
//                 <tr key={w.workshop_id}>
//                   <td>{w.workshop_id}</td>
//                   <td>{w.subject}</td>
//                   <td>{w.from_date}</td>
//                   <td>{w.till_date}</td>
//                   <td>{w.technologies}</td>
//                   <td>{w.project}</td>
//                   <td>{w.duration}</td>
//                   <td>{w.centre}</td>
//                   <td>{w.mode}</td>
//                   <td>{w.speakers}</td>
//                   <td>{w.participant_count}</td>
//                   <td>{w.participant_count === 0 ? (
//                     <button className="add-participants-button" onClick={() => navigate('/upload-participants', { state: { workshopId: w.workshop_id } })}>Add Participants</button>)
//                   : (<button
//   className="view-participants-button"
//   onClick={() => navigate(`/workshops/${w.workshop_id}/participants`, 
//     { state: { subject: w.subject, from: w.from_date, till: w.till_date, centre: w.centre, speaker: w.speakers }}
//     )}>
//   View Participants
// </button>)
//                     }</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="10" className="no-results">No workshops found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
        
//       )}
//       <div className="pagination-controls">
//   <button
//     onClick={handlePrevPage}
//     disabled={!pagination.has_prev_page}
//     className="pagination-button"
//   >
//     Previous
//   </button>
//   <span>Page {pagination.current_page} of {pagination.total_pages}</span>
//   <button
//     onClick={handleNextPage}
//     disabled={!pagination.has_next_page}
//     className="pagination-button"
//   >
//     Next
//   </button>
// </div>
      
      
//     </div>
//   );
// };

// export default WorkshopTable;

// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { getWorkshops, getWorkshopFilters, downloadWorkshopReports } from '../services/api';
// import StatsCard from './StatsCard';

// import './Workshops.css';
 
// const WorkshopTable = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [workshops, setWorkshops] = useState([]);
//   const [filters, setFilters] = useState({page: 1 });
//   const [filterOptions, setFilterOptions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [downloadFormat, setDownloadFormat] = useState('excel'); // default format
//   const [totalWorkshops, setTotalWorkshops] = useState(0);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [selectedWorkshop, setSelectedWorkshop] = useState(null);
 

//   // Fetch filter options on mount
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

//   // state for pagination
// const [pagination, setPagination] = useState({
//   current_page: 1,
//   total_pages: 1,
//   has_next_page: false,
//   has_prev_page: false
// });

//   // Fetch workshops whenever filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const workshopData = await getWorkshops(filters);
//         setWorkshops(workshopData?.data?.workshops || []);
//         setPagination(workshopData?.data?.pagination || {});
//         setTotalWorkshops(workshopData?.data?.pagination.total_items || 0);
//       } catch (error) {
//         console.error('Error fetching workshops:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [filters]);

//   // Handle filter change
//   const handleFilterChange = (e, field) => {
//     const value = e.target.value;
//     setFilters(prev => ({
//       ...prev,
//       [field]: value === 'All' ? undefined : value,
//       page: 1
//     }));
//   };

//   const handleDateChange = (e, field) => {
//     const value = e.target.value;
//     setFilters(prev => ({
//       ...prev,
//       [field]: value || undefined,
//       page: 1
//     }));
//   };

//   const handleNextPage = () => {
//   if (pagination.has_next_page) {
//     setFilters(prev => ({
//       ...prev,
//       page: pagination.current_page + 1
//     }));
//   }
// };



// const handlePrevPage = () => {
//   if (pagination.has_prev_page) {
//     setFilters(prev => ({
//       ...prev,
//       page: pagination.current_page - 1
//     }));
//   }
// };

//   return (
//     <div className="workshop-table-container">
      

//     <div className="header-controls">
//       <div className="download-controls">
//         <select
//           value={downloadFormat}
//           onChange={(e) => setDownloadFormat(e.target.value)}
//           className="format-selector"
//         >
//           <option value="excel">Excel</option>
//           <option value="pdf">PDF</option>
//         </select>
//         <button onClick={() => downloadWorkshopReports(filters, downloadFormat)} className="download-button">
//           Download Report
//         </button>
//       </div>
//       <div >
//         <div >
//           <StatsCard title="Total Workshops:" value={totalWorkshops} loading={loading} />
//         </div>
//       </div>
//     </div>

//       <div className="filters">
//       <small className="note">Workshops are shown in order of Date they started.</small><br/>
//         <select onChange={(e) => handleFilterChange(e, 'subject')} value={filters.subject || 'All'}>
//           <option value = 'All'>All Subjects</option>
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
//           <option value = 'All'>All Technologies</option>
//           {filterOptions.technologies?.map((tech, i) => (
//             <option key={i} value={tech}>{tech}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'project')} value={filters.project || 'All'}>
//           <option value = 'All'>All Projects</option>
//           {filterOptions.projects?.map((proj, i) => (
//             <option key={i} value={proj}>{proj}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'centre')} value={filters.centre || 'All'}>
//           <option value = 'All'>All Centres</option>
//           {filterOptions.centres?.map((c, i) => (
//             <option key={i} value={c}>{c}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'mode')} value={filters.mode || 'All'}>
//           <option value = 'All'>All Modes</option>
//           {filterOptions.modes?.map((m, i) => (
//             <option key={i} value={m}>{m}</option>
//           ))}
//         </select>

//         <select onChange={(e) => handleFilterChange(e, 'speaker')} value={filters.speaker || 'All'}>
//           <option value = 'All'>All Speakers</option>
//           {filterOptions.speakers?.map((s, i) => (
//             <option key={i} value={s}>{s}</option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="loading">Loading workshops...</div>
//       ) : (
//         <table className="workshop-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Subject </th>
//               <th>From Date</th>
//               <th>Till Date</th>
//               <th>Technology</th>
//               <th>Project</th>
//               <th>Duration</th>
//               <th>Centre</th>
//               <th>Mode</th>
//               <th>Speaker</th>
//               <th>Participants</th>
//               <th>Action</th>
//               <th>Update</th>
//             </tr>
//           </thead>
//           <tbody>
//             {workshops.length > 0 ? (
//               workshops.map(w => (
//                 <tr key={w.workshop_id}>
//                   <td>{w.workshop_id}</td>
//                   <td>{w.subject}</td>
//                   <td>{w.from_date}</td>
//                   <td>{w.till_date}</td>
//                   <td>{w.technologies}</td>
//                   <td>{w.project}</td>
//                   <td>{w.duration}</td>
//                   <td>{w.centre}</td>
//                   <td>{w.mode}</td>
//                   <td>{w.speakers}</td>
//                   <td>{w.participant_count}</td>
//                   <td>{w.participant_count === 0 ? (
//                     <button className="add-participants-button" onClick={() => navigate('/upload-participants', { state: { workshopId: w.workshop_id } })}>Add Participants</button>)
//                   : (<button
//   className="view-participants-button"
//   onClick={() => navigate(`/workshops/${w.workshop_id}/participants`, 
//     { state: { subject: w.subject, from: w.from_date, till: w.till_date, centre: w.centre, speaker: w.speakers }}
//     )}>
//   View Participants
// </button>)
//                     }</td>
//                    <td>
//   <button 
//     className="update-workshop-button"
//     onClick={() => {
//       setSelectedWorkshop({
//         workshop_id: w.workshop_id,
//         subject: w.subject,
//         from_date: w.from_date,
//         till_date: w.till_date,
//         duration: w.duration,
//         technology: w.technologies ? w.technologies.split(', ') : [],
//         project: w.project,
//         centre: w.centre,
//         mode: w.mode,
//         speaker_name: w.speakers ? w.speakers.split(', ') : [],
//         workshop_type: w.workshopType,
//         other1: w.otherOption1,
//         other2: w.otherOption2,
//         other3: w.otherOption3
//       });
//       setShowUpdateModal(true);
//     }}
//   >
//     Update
//   </button>
// </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="10" className="no-results">No workshops found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
        
//       )}
//       <div className="pagination-controls">
//   <button
//     onClick={handlePrevPage}
//     disabled={!pagination.has_prev_page}
//     className="pagination-button"
//   >
//     Previous
//   </button>
//   <span>Page {pagination.current_page} of {pagination.total_pages}</span>
//   <button
//     onClick={handleNextPage}
//     disabled={!pagination.has_next_page}
//     className="pagination-button"
//   >
//     Next
//   </button>
// </div>
      
      
//     </div>
//   );
// };

// export default WorkshopTable;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getWorkshops, getWorkshopFilters, downloadWorkshopReports, updateWorkshop } from '../services/api';
import StatsCard from './StatsCard';
import './Workshops.css';

const WorkshopTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [filters, setFilters] = useState({ page: 1 });
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState('excel');
  const [totalWorkshops, setTotalWorkshops] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch filter options on mount
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

  // State for pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false
  });

  // Fetch workshops whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const workshopData = await getWorkshops(filters);
        setWorkshops(workshopData?.data?.workshops || []);
        setPagination(workshopData?.data?.pagination || {});
        setTotalWorkshops(workshopData?.data?.pagination.total_items || 0);
      } catch (error) {
        console.error('Error fetching workshops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // Handle filter change
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
      setFilters(prev => ({
        ...prev,
        page: pagination.current_page + 1
      }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.has_prev_page) {
      setFilters(prev => ({
        ...prev,
        page: pagination.current_page - 1
      }));
    }
  };

  const handleUpdateWorkshop = async (updatedData) => {
    setUpdateLoading(true);
    try {
      await updateWorkshop(updatedData);
      setUpdateSuccess(true);
      // Refresh the workshops list
      const workshopData = await getWorkshops(filters);
      setWorkshops(workshopData?.data?.workshops || []);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating workshop:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const UpdateWorkshopModal = ({ workshop, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      workshop_id: workshop?.workshop_id || '',
      subject: workshop?.subject || '',
      from_date: workshop?.from_date || '',
      till_date: workshop?.till_date || '',
      duration: workshop?.duration || '',
      technology: workshop?.technology || [],
      project: workshop?.project || '',
      centre: workshop?.centre || '',
      mode: workshop?.mode || '',
      speaker_name: workshop?.speaker_name || [],
      workshop_type: workshop?.workshop_type || '',
      other1: workshop?.other1 || '',
      other2: workshop?.other2 || '',
      other3: workshop?.other3 || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e, field) => {
      const { value } = e.target;
      const values = value.split(',').map(item => item.trim());
      setFormData(prev => ({ ...prev, [field]: values }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await onUpdate(formData);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Update Workshop #{workshop.workshop_id}</h2>
          {updateSuccess && <div className="success-message">Workshop updated successfully!</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subject:</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>From Date:</label>
              <input
                type="date"
                name="from_date"
                value={formData.from_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Till Date:</label>
              <input
                type="date"
                name="till_date"
                value={formData.till_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (hours):</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Technologies (comma separated):</label>
              <input
                name="technology"
                value={formData.technology.join(', ')}
                onChange={(e) => handleArrayChange(e, 'technology')}
              />
            </div>

            <div className="form-group">
              <label>Project:</label>
              <input
                name="project"
                value={formData.project}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Centre:</label>
              <select
                name="centre"
                value={formData.centre}
                onChange={handleChange}
              >
                {filterOptions.centres?.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Mode:</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
              >
                {filterOptions.modes?.map((m, i) => (
                  <option key={i} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Speakers (comma separated):</label>
              <input
                name="speaker_name"
                value={formData.speaker_name.join(', ')}
                onChange={(e) => handleArrayChange(e, 'speaker_name')}
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
                {updateLoading ? 'Updating...' : 'Update Workshop'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="workshop-table-container">
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
            onClick={() => downloadWorkshopReports(filters, downloadFormat)} 
            className="download-button"
          >
            Download Report
          </button>
        </div>
        <div>
          <div>
            <StatsCard title="Total Workshops:" value={totalWorkshops} loading={loading} />
          </div>
        </div>
      </div>

      <div className="filters">
        <small className="note">Workshops are shown in order of Date they started.</small><br/>
        <select onChange={(e) => handleFilterChange(e, 'subject')} value={filters.subject || 'All'}>
          <option value='All'>All Subjects</option>
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
          <option value='All'>All Technologies</option>
          {filterOptions.technologies?.map((tech, i) => (
            <option key={i} value={tech}>{tech}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'project')} value={filters.project || 'All'}>
          <option value='All'>All Projects</option>
          {filterOptions.projects?.map((proj, i) => (
            <option key={i} value={proj}>{proj}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'centre')} value={filters.centre || 'All'}>
          <option value='All'>All Centres</option>
          {filterOptions.centres?.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'mode')} value={filters.mode || 'All'}>
          <option value='All'>All Modes</option>
          {filterOptions.modes?.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilterChange(e, 'speaker')} value={filters.speaker || 'All'}>
          <option value='All'>All Speakers</option>
          {filterOptions.speakers?.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading workshops...</div>
      ) : (
        <table className="workshop-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>From Date</th>
              <th>Till Date</th>
              <th>Technology</th>
              <th>Project</th>
              <th>Duration</th>
              <th>Centre</th>
              <th>Mode</th>
              <th>Speaker</th>
              <th>Participants</th>
              <th>Action</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {workshops.length > 0 ? (
              workshops.map(w => (
                <tr key={w.workshop_id}>
                  <td>{w.workshop_id}</td>
                  <td>{w.subject}</td>
                  <td>{w.from_date}</td>
                  <td>{w.till_date}</td>
                  <td>{w.technologies}</td>
                  <td>{w.project}</td>
                  <td>{w.duration}</td>
                  <td>{w.centre}</td>
                  <td>{w.mode}</td>
                  <td>{w.speakers}</td>
                  <td>{w.participant_count}</td>
                  <td>
                    {w.participant_count === 0 ? (
                      <button 
                        className="add-participants-button" 
                        onClick={() => navigate('/upload-participants', { state: { workshopId: w.workshop_id } })}
                      >
                        Add Participants
                      </button>
                    ) : (
                      <button
                        className="view-participants-button"
                        onClick={() => navigate(
                          `/workshops/${w.workshop_id}/participants`,
                          { state: { 
                            subject: w.subject, 
                            from: w.from_date, 
                            till: w.till_date, 
                            centre: w.centre, 
                            speaker: w.speakers 
                          }}
                        )}
                      >
                        View Participants
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="update-workshop-button"
                      onClick={() => {
                        setSelectedWorkshop({
                          workshop_id: w.workshop_id,
                          subject: w.subject,
                          from_date: w.from_date,
                          till_date: w.till_date,
                          duration: w.duration,
                          technology: w.technologies ? w.technologies.split(', ') : [],
                          project: w.project,
                          centre: w.centre,
                          mode: w.mode,
                          speaker_name: w.speakers ? w.speakers.split(', ') : [],
                          workshop_type: w.workshopType,
                          other1: w.otherOption1,
                          other2: w.otherOption2,
                          other3: w.otherOption3
                        });
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
                <td colSpan="13" className="no-results">No workshops found</td>
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
        <UpdateWorkshopModal
          workshop={selectedWorkshop}
          onClose={() => {
            setShowUpdateModal(false);
            setUpdateSuccess(false);
          }}
          onUpdate={handleUpdateWorkshop}
        />
      )}
    </div>
  );
};

export default WorkshopTable;
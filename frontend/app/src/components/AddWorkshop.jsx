// src/components/AddWorkshop.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addWorkshop } from '../services/api';
import './AddWorkshop.css';

const AddWorkshop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    from_date: '',
    till_date: '',
    duration: '',
    technology: '',
    project: '',
    centre: '',
    mode: '',
    speaker_name: '',
    workshop_type: '',
    other1: '',
    other2: '',
    other3: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



    // Refs for the textareas
  const technologyRef = useRef(null);
  const speakerNameRef = useRef(null);
  const other1Ref = useRef(null);
  const other2Ref = useRef(null);
  const other3Ref = useRef(null);

    // Adjust height of textarea dynamically
  const autoExpand = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
        if (name === 'technology') autoExpand(e);
    if (name === 'speaker_name') autoExpand(e);
    if (name === 'other1') autoExpand(e);
    if (name === 'other2') autoExpand(e);
    if (name === 'other3') autoExpand(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {

      const payload = {
      ...formData,
      technology: formData.technology
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
      speaker_name: formData.speaker_name
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
    };
    const response = await addWorkshop(payload); // assuming it returns { message: "...", workshop_id: "12345" }
    const { bool, message, workshop_id } = response;
       navigate('/workshop-success', { state: { formData, workshop_id } }); 
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add workshop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-workshop">
      <h1>Add New Workshop</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder='React Workshop'
              required
            />
          </div>
          <div className="form-row">
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
            <label>Duration (in hours):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
           </div>
          <div className="form-row">
          <div className="form-group">
            <label>Technology:</label>
            <textarea
            name="technology"
            value={formData.technology}
            onChange={handleChange}
            placeholder=''
            className="auto-expand"
    rows={1}
    required
  />
  <small className="input-note">
    Do not use abbreviations of technology names. Use commas to separate multiple values if applicable.
  </small>
          </div>
          
          
         
<div className="form-group">
            <label>Project:</label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              
            />
          </div>
          </div>
         
    
        
      <div className="form-row">
          <div className="form-group">
            <label>Center:</label>
            <select
              name="centre"
              value={formData.centre}
              onChange={handleChange}
              required
            >
              <option value="">Select Center</option>
              <option value="Janakpuri">Janakpuri</option>
              <option value="Karkardooma">Karkardooma</option>
              <option value="Inderlok">Inderlok</option>
            </select>
          </div>
          
          
            <div className="form-group">
            <label>Mode:</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              required
            >
              <option value="">Select Mode</option>
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          </div>
          <div className="form-row">

          <div className="form-group">
            <label>Speaker Name:</label>
             <textarea
    name="speaker_name"
    value={formData.speaker_name}
    onChange={handleChange}
    className="auto-expand"
    rows={1}
    required
  />
   <small className="input-note">
    Use commas to separate multiple speaker names if applicable.
  </small>
          </div>
          
      

       
        
          <div className="form-group">
            <label>Workshop Type:</label>
            <input
              type="text"
              name="workshop_type"
              value={formData.workshop_type}
              onChange={handleChange}
              
            />
          </div>
          </div>
          <div className="form-row">
          <div className="form-group">
            <label>Other Option 1:</label>
            <textarea
    name="other1"
    value={formData.other1}
    onChange={handleChange}
    className="auto-expand"
    rows={1}
  />
          </div>
       
          
            <div className="form-group">
            <label>Other Option 2:</label>
            <textarea
    name="other2"
    value={formData.other2}
    onChange={handleChange}
    className="auto-expand"
    rows={1}
  />
          </div>
          
          <div className="form-group">
            <label>Other Option 3:</label>
            <textarea
    name="other3"
    value={formData.other3}
    onChange={handleChange}
    className="auto-expand"
    rows={1}
  />
          </div>
          </div>
       
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : 'Add Workshop'}
        </button>
      </form>
    </div>
  );
};

export default AddWorkshop;
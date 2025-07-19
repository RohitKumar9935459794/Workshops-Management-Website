import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

// Register a new user
export const registerUser = async ({ username, email, password, usertype }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, usertype }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Registration failed');
    return data;
  } catch (error) {
    throw error;
  }
};

// Login a user
export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Login failed');
    return data;
  } catch (error) {
    throw error;
  }
};

// Access protected route
export const getProtectedData = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/protected`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // JWT from localStorage
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Unauthorized');
    return data;
  } catch (error) {
    throw error;
  }
};


//API 1: adding new workshop data
export const addWorkshop = async (workshopData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workshops/new`, workshopData);
    return response.data;
  } catch (error) {
    console.error('Error adding workshop:', error);
    throw error;
  }
};

//API 2: adding participant for workshop with workshopid

export const addParticipantToWorkshop = async (workshopId, file) => {
 try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/workshops/${workshopId}/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading participants:', error);
    throw error;
  }
};


//API 3: get workshop filters
export const getWorkshopFilters = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workshops/filters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};


//API 4:  get total workshops and participant in particular financial year

export const getWorkshopStats = async (year) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workshops/stats/${year}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

//API 5: get wrokshop reports with or without filter
export const getWorkshops = async (params = {}) => {
  try {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
    );
    const response = await axios.get(`${API_BASE_URL}/workshops/reports`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching workshops:', error);
    throw error;
  }
};

//API 6: get participant reports with or without filter
export const getParticipantsReports = async ( params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/participants/reports`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching participants:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch participants');
  }
};

//API 7
// Fetch participants for a specific workshop by its ID (VARCHAR) with pagination

export const getParticipantswithId = async (workshopId, page=1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/participants/${workshopId}`,{
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching participants:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch participants');
  }
};


//API 8
//  to download filtered workshop reports as excel/pdf (one api format as query parameter)
export const downloadWorkshopReports = async (filters, format) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workshops/reports/download`, {
      params: { ...filters, format },
      responseType: 'blob'
    });

    // Check if backend responded with a valid Excel/PDF file
    const contentType = response.headers['content-type'];
    if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') &&
        !contentType.includes('application/pdf')) {
      // It's probably an error sent as JSON
      const reader = new FileReader();
      reader.onload = () => {
        const errorMsg = JSON.parse(reader.result);
        console.error('Download failed:', errorMsg.message || 'Unknown error');
        alert(`Download failed: ${errorMsg.message || 'Invalid response from server'}`);
      };
      reader.readAsText(response.data);
      return;
    }

    // Extract filename from response headers
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
    const extension = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'dat';
    const filename = filenameMatch ? filenameMatch[1] : `workshop_report.${extension}`;

    // Create and trigger file download
    const blob = new Blob([response.data], { type: contentType });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading workshop report:', error);
    alert('Failed to download report. Please try again later.');
  }
};


//API 9
//  to download filtered participant reports as excel/pdf 

export const downloadParticipantReports = async (filters, format) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/participants/reports/download`, {
      params: { ...filters, format },
      responseType: 'blob'
    });

    // Check if backend responded with a valid Excel/PDF file
    const contentType = response.headers['content-type'];
    if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') &&
        !contentType.includes('application/pdf')) {
      // It's probably an error sent as JSON
      const reader = new FileReader();
      reader.onload = () => {
        const errorMsg = JSON.parse(reader.result);
        console.error('Download failed:', errorMsg.message || 'Unknown error');
        alert(`Download failed: ${errorMsg.message || 'Invalid response from server'}`);
      };
      reader.readAsText(response.data);
      return;
    }

    // Extract filename from response headers
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
    const extension = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'dat';
    const filename = filenameMatch ? filenameMatch[1] : `participant_report.${extension}`;

    // Create and trigger file download
    const blob = new Blob([response.data], { type: contentType });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error downloading Participant report:', error);
    alert('Failed to download report. Please try again later.');
  }
};


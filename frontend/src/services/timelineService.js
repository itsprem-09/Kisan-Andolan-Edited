import api from './api';

// Get all timeline entries
export const getTimelines = async (params = {}) => {
  try {
    const response = await api.get('/api/timeline', { params });
    
    // Handle empty response
    if (!response.data) {
      return { data: [] };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in timelineService.getTimelines:', error);
    // For 404 errors (endpoint not found), return empty array instead of throwing
    if (error.response?.status === 404) {
      console.log('Timeline endpoint returned 404, returning empty array');
      return { data: [] };
    }
    throw error;
  }
};

// Get timeline entry by ID
export const getTimelineById = async (id) => {
  try {
    const response = await api.get(`/api/timeline/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching timeline with ID ${id}:`, error);
    throw error;
  }
};

// Create a new timeline entry
export const createTimeline = async (timelineData) => {
  try {
    // Check if we're dealing with FormData
    const isFormData = timelineData instanceof FormData;
    
    // Configure request with appropriate headers for FormData
    const config = {};
    if (isFormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    
    const response = await api.post('/api/timeline', timelineData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating timeline entry:', error);
    throw error;
  }
};

// Update a timeline entry
export const updateTimeline = async (id, timelineData) => {
  try {
    // Check if we're dealing with FormData
    const isFormData = timelineData instanceof FormData;
    
    // Configure request with appropriate headers for FormData
    const config = {};
    if (isFormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    
    const response = await api.put(`/api/timeline/${id}`, timelineData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating timeline with ID ${id}:`, error);
    throw error;
  }
};

// Delete a timeline entry
export const deleteTimeline = async (id) => {
  try {
    const response = await api.delete(`/api/timeline/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting timeline with ID ${id}:`, error);
    throw error;
  }
};

// Get key milestones only
export const getKeyMilestones = async () => {
  try {
    const response = await api.get('/api/timeline', { params: { isKeyMilestone: true } });
    return response.data;
  } catch (error) {
    console.error('Error fetching key milestones:', error);
    throw error;
  }
};

const timelineService = {
  getTimelines,
  getTimelineById,
  createTimeline,
  updateTimeline,
  deleteTimeline,
  getKeyMilestones
};

export default timelineService; 
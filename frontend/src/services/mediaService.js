import api from './api';
import visionService from './visionService';

const API_URL = '/api/media';

const getMediaItems = (params) => api.get(API_URL, { params });
const getMediaItemById = (id) => api.get(`${API_URL}/${id}`);
const createMediaItem = async (data) => {
  console.log("From Media Service:" + data);
  
  try {
    const isFormData = data instanceof FormData;
    const config = {};
    if (isFormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    const response = await api.post(API_URL, data, config);
    return response.data;
  } catch (error) {
    console.error('Error creating media item:', error);
    throw error;
  }
};

const updateMediaItem = async (id, data) => {
  try {
    const isFormData = data instanceof FormData;
    const config = {};
    if (isFormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    const response = await api.put(`${API_URL}/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating media item with ID ${id}:`, error);
    throw error;
  }
};
const deleteMediaItem = (id) => api.delete(`${API_URL}/${id}`);

// Function to fetch both media items and vision data
const getMediaAndVisionData = async () => {
  const mediaResponse = await getMediaItems();
  const visionResponse = await visionService.getVision();
  
  return {
    mediaItems: mediaResponse.data,
    visionData: visionResponse.data
  };
};

const mediaService = {
  getMediaItems,
  getMediaItemById,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  getMediaAndVisionData
};

export default mediaService;

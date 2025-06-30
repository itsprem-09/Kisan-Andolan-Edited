import api from './api';

const API_URL = '/api/vision';

const getVision = () => {
  return api.get(API_URL);
};

const createOrUpdateVision = (visionData) => {
  return api.post(API_URL, visionData);
};

const visionService = {
  getVision,
  createOrUpdateVision,
};

export default visionService;

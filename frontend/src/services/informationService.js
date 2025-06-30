import api from './api';

const API_URL = '/api/information';

const getInformationItems = () => {
  return api.get(API_URL);
};

const createInformationItem = (itemData) => {
  return api.post(API_URL, itemData);
};

const updateInformationItem = (groupTitle, itemId, itemData) => {
  return api.put(`${API_URL}/${groupTitle}/${itemId}`, itemData);
};

const deleteInformationItem = (groupTitle, itemId) => {
  return api.delete(`${API_URL}/${groupTitle}/${itemId}`);
};

const informationService = {
  getInformationItems,
  createInformationItem,
  updateInformationItem,
  deleteInformationItem,
};

export default informationService;

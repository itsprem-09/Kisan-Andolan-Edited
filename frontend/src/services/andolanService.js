import api from './api';

const API_URL = '/api/andolan';

const getAndolanEvents = () => {
  return api.get(API_URL);
};

const createAndolanEvent = (eventData) => {
  return api.post(API_URL, eventData);
};

const updateAndolanEvent = (id, eventData) => {
  return api.put(`${API_URL}/${id}`, eventData);
};

const deleteAndolanEvent = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const andolanService = {
  getAndolanEvents,
  createAndolanEvent,
  updateAndolanEvent,
  deleteAndolanEvent,
};

export default andolanService;

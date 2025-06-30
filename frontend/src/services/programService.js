import api from './api';

const API_URL = '/api/programs';

const getPrograms = () => api.get(API_URL);
const getProgramById = (id) => api.get(`${API_URL}/${id}`);
const createProgram = (data) => api.post(API_URL, data);
const updateProgram = (id, data) => api.put(`${API_URL}/${id}`, data);
const deleteProgram = (id) => api.delete(`${API_URL}/${id}`);

const programService = {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};

export default programService;

import api from './api';

const API_URL = '/api/projects';

const getProjects = () => api.get(API_URL);
const getProjectById = (id) => api.get(`${API_URL}/${id}`);
const createProject = (data) => api.post(API_URL, data);
const updateProject = (id, data) => api.put(`${API_URL}/${id}`, data);
const deleteProject = (id) => api.delete(`${API_URL}/${id}`);

const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export default projectService;

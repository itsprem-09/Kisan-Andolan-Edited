import api from './api';

const API_URL = '/api/team';

const getTeamMembers = () => {
  return api.get(API_URL);
};

const getTeamMember = (id) => {
  return api.get(`${API_URL}/${id}`);
};

const createTeamMember = (memberData) => {
  return api.post(API_URL, memberData);
};

const updateTeamMember = (id, memberData) => {
  return api.put(`${API_URL}/${id}`, memberData);
};

const deleteTeamMember = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const teamService = {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};

export default teamService;

import api from './api';

// Submit a new partnership inquiry
export const submitPartnerInquiry = async (data) => {
  try {
    const response = await api.post('/api/partnership-inquiries', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting partnership inquiry:', error);
    throw error;
  }
};

// Get all partnership inquiries (admin)
export const getPartnerInquiries = async () => {
  try {
    const response = await api.get('/api/partnership-inquiries');
    return response.data;
  } catch (error) {
    console.error('Error fetching partnership inquiries:', error);
    throw error;
  }
};

// Update a partnership inquiry status (admin)
export const updatePartnerInquiry = async (id, data) => {
  try {
    const response = await api.put(`/api/partnership-inquiries/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating partnership inquiry:', error);
    throw error;
  }
};

// Delete a partnership inquiry (admin)
export const deletePartnerInquiry = async (id) => {
  try {
    const response = await api.delete(`/api/partnership-inquiries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting partnership inquiry:', error);
    throw error;
  }
};

const partnerInquiryService = {
  submitPartnerInquiry,
  getPartnerInquiries,
  updatePartnerInquiry,
  deletePartnerInquiry
};

export default partnerInquiryService; 
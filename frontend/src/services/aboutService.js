import api from './api';

// Get all about page content
export const getAboutContent = async () => {
  try {
    const response = await api.get('/api/about');
    
    // Handle empty response
    if (!response.data) {
      return { data: {} };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in aboutService.getAboutContent:', error);
    // For 404 errors (endpoint not found), return empty object instead of throwing
    if (error.response?.status === 404) {
      console.log('About endpoint returned 404, returning empty object');
      return { data: {} };
    }
    throw error;
  }
};

// Update impact metrics
export const updateImpactMetrics = async (data) => {
  try {
    console.log('aboutService.updateImpactMetrics called with:', data);
    const response = await api.put('/api/about/impact-metrics', data);
    console.log('aboutService.updateImpactMetrics response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating impact metrics:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data || 'No response data',
      status: error.response?.status || 'No status',
      headers: error.response?.headers || 'No headers'
    });
    throw error;
  }
};

// Update info boxes
export const updateInfoBoxes = async (infoBoxes) => {
  try {
    const response = await api.put('/api/about/info-boxes', { infoBoxes });
    return response.data;
  } catch (error) {
    console.error('Error updating info boxes:', error);
    throw error;
  }
};

// Update testimonials
export const updateTestimonials = async (data) => {
  try {
    // Check if data is FormData (for file uploads) or regular object
    const isFormData = data instanceof FormData;
    
    // Create config based on data type
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000, // 60 second timeout for file uploads
      onUploadProgress: (progressEvent) => {
        console.log(`Upload Progress: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)}%`);
      }
    } : {
      timeout: 15000 // 15 second timeout for regular requests
    };
    
    // Log what we're sending
    if (isFormData) {
      console.log('Sending FormData with testimonials and image files');
      
      // Log file entries
      for (const [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`- File: ${key} (${value.name}, ${value.size} bytes)`);
        }
      }
    } else {
      console.log(`Sending JSON with ${data.testimonials?.length || 0} testimonials`);
    }
    
    // Create an AbortController to handle request timeouts manually if needed
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // Slightly longer than axios timeout
    
    try {
      // Make the API request
      const response = await api.put('/api/about/testimonials', data, {
        ...config,
        signal: controller.signal
      });
      
      // Clear the timeout since request completed successfully
      clearTimeout(timeoutId);
      
      console.log('Testimonials update successful');
      return response.data;
    } catch (axiosError) {
      clearTimeout(timeoutId);
      
      if (axiosError.name === 'AbortError' || axiosError.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The server took too long to respond, possibly due to image upload issues.');
      }
      throw axiosError;
    }
  } catch (error) {
    console.error('Error updating testimonials:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data || 'No response data',
      status: error.response?.status || 'No status'
    });
    
    // Provide more descriptive error messages
    if (error.message.includes('timeout') || error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The server took too long to respond, possibly due to image upload issues.');
    } else if (error.response?.status === 413) {
      throw new Error('Image too large. Please use an image smaller than 10MB.');
    } else if (error.response?.data?.message) {
      throw new Error(`Error updating testimonial: ${error.response.data.message}`);
    } else {
      throw error;
    }
  }
};

// Update community stats
export const updateCommunityStats = async (data) => {
  try {
    console.log('aboutService.updateCommunityStats called with:', data);
    const response = await api.put('/api/about/community-stats', data);
    console.log('aboutService.updateCommunityStats response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating community stats:', error);
    throw error;
  }
};

// Update partners
export const updatePartners = async (partnerCategories) => {
  try {
    const response = await api.put('/api/about/partners', { partnerCategories });
    return response.data;
  } catch (error) {
    console.error('Error updating partners:', error);
    throw error;
  }
};

// Update partnership approach
export const updatePartnershipApproach = async (data) => {
  try {
    const response = await api.put('/api/about/partnership-approach', data);
    return response.data;
  } catch (error) {
    console.error('Error updating partnership approach:', error);
    throw error;
  }
};

const aboutService = {
  getAboutContent,
  updateImpactMetrics,
  updateInfoBoxes,
  updateTestimonials,
  updateCommunityStats,
  updatePartners,
  updatePartnershipApproach
};

export default aboutService; 
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const baseURL = `${API_BASE_URL}/api/nominations`;
// Fallback URL for when local server is not available
const fallbackURL = 'https://api.rashtriyakisanmanch.com/api/nominations';
const pdfURL = `${API_BASE_URL}/api/pdf`;
const fallbackPdfURL = 'https://api.rashtriyakisanmanch.com/api/pdf';

console.log('Nomination service initialized with baseURL:', baseURL);

const nominationService = {
  // Submit a new nomination
  submitNomination: async (nominationData) => {
    try {
      const formData = new FormData();
      
      // Nominee details
      formData.append('nomineeName', nominationData.nomineeName);
      formData.append('nomineeAge', nominationData.nomineeAge);
      formData.append('nomineeGender', nominationData.nomineeGender);
      formData.append('district', nominationData.district);
      formData.append('state', nominationData.state);
      formData.append('occupation', nominationData.occupation);
      formData.append('contribution', nominationData.contribution);
      
      // Nominator details
      formData.append('nominatorName', nominationData.nominatorName);
      formData.append('nominatorMobile', nominationData.nominatorMobile);
      formData.append('nominatorEmail', nominationData.nominatorEmail || '');
      formData.append('nominationType', 'VP Singh – Kisan Gaurav Puraskar');

      console.log('Documents to upload:', {
        aadharCard: nominationData.documents?.aadharCard ? nominationData.documents.aadharCard.name : 'None',
        photograph: nominationData.documents?.photograph ? nominationData.documents.photograph.name : 'None',
        additionalDocument: nominationData.documents?.additionalDocument ? 
          nominationData.documents.additionalDocument.name : 'None'
      });

      // Required documents - append files directly
      if (nominationData.documents?.aadharCard) {
        formData.append('aadharCard', nominationData.documents.aadharCard);
      }
      
      if (nominationData.documents?.photograph) {
        formData.append('photograph', nominationData.documents.photograph);
      }

      // Optional documents
      if (nominationData.documents?.additionalDocument) {
        formData.append('additionalDocument', nominationData.documents.additionalDocument);
        formData.append('additionalDocumentType', nominationData.documents?.additionalDocumentType || 'none');
      } else if (nominationData.documents?.additionalDocumentType === 'video_url' && nominationData.documents?.additionalDocumentUrl) {
        formData.append('additionalDocumentUrl', nominationData.documents.additionalDocumentUrl);
        formData.append('additionalDocumentType', 'video_url');
      }

      console.log('Submitting nomination to API...', baseURL);
      
      try {
        // First try with the configured API URL
        const response = await axios.post(baseURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Nomination submitted successfully:', response.data);
        return response.data;
      } catch (localError) {
        console.error("Local API error:", localError);
        // Log more detailed error information
        if (localError.response) {
          console.error("Response data:", localError.response.data);
          console.error("Response status:", localError.response.status);
          console.error("Response headers:", localError.response.headers);
        } else if (localError.request) {
          console.error("No response received, request was:", localError.request);
        } else {
          console.error("Error setting up request:", localError.message);
        }
        
        if (localError.response?.status === 500 || !localError.response) {
          console.log("Local API not available, trying production API...");
          try {
            // If local API fails, try the production API
            const prodResponse = await axios.post(fallbackURL, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('Nomination submitted to fallback API successfully:', prodResponse.data);
            return prodResponse.data;
          } catch (prodError) {
            console.error("Production API error:", prodError.response?.data || prodError.message);
            throw new Error(prodError.response?.data?.message || 'Error submitting nomination to production API');
          }
        } else {
          // For client errors (400-level), return the error from the local API
          throw new Error(localError.response?.data?.message || 'Error submitting nomination');
        }
      }
    } catch (error) {
      console.error('Nomination submission error:', error);
      throw error; // Pass the original error through for more detailed debugging
    }
  },

  // Generate and download nomination PDF
  generateAndDownloadNominationPdf: async (nominationData) => {
    try {
      // Prepare data for PDF generation
      const pdfData = {
        nomineeName: nominationData.nomineeName,
        nomineeAge: nominationData.nomineeAge,
        nomineeGender: nominationData.nomineeGender,
        district: nominationData.district,
        state: nominationData.state,
        occupation: nominationData.occupation,
        contribution: nominationData.contribution,
        nominatorName: nominationData.nominatorName,
        nominatorMobile: nominationData.nominatorMobile,
        nominatorEmail: nominationData.nominatorEmail,
        referenceNumber: nominationData.referenceNumber,
        status: nominationData.status || 'New',
        nominationDate: nominationData.createdAt || new Date()
      };

      // First try with the configured API URL with blob response type for direct download
      try {
        const response = await axios.post(`${pdfURL}/nomination-receipt`, pdfData, {
          responseType: 'blob'
        });
        
        // Create a download link and trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `nomination_${nominationData.referenceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
      } catch (localError) {
        console.log("Local PDF API not available, trying production API...");
        try {
          // If local API fails, try the production API
          const prodResponse = await axios.post(`${fallbackPdfURL}/nomination-receipt`, pdfData, {
            responseType: 'blob'
          });
          
          // Create a download link and trigger the download
          const url = window.URL.createObjectURL(new Blob([prodResponse.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `nomination_${nominationData.referenceNumber}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          return true;
        } catch (prodError) {
          console.log("Production PDF API also not available");
          throw new Error('PDF generation service unavailable');
        }
      }
    } catch (error) {
      console.error("Error downloading nomination receipt:", error);
      throw error;
    }
  },

  // Admin functions - get all nominations
  getNominations: async (filters = {}, token) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query parameters if they exist
      if (filters.district) queryParams.append('district', filters.district);
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sector) queryParams.append('sector', filters.sector);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await axios.get(`${baseURL}${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching nominations');
    }
  },

  // Admin functions - update nomination status
  updateNominationStatus: async (nominationId, status, notes, token) => {
    try {
      const response = await axios.put(
        `${baseURL}/${nominationId}`,
        { status, notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating nomination status');
    }
  },

  // Admin functions - delete nomination
  deleteNomination: async (nominationId, token) => {
    try {
      const response = await axios.delete(
        `${baseURL}/${nominationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting nomination');
    }
  },
  
  // Get nomination by reference number (public access)
  getNominationByReference: async (referenceNumber) => {
    try {
      const response = await axios.get(`${baseURL}/reference/${referenceNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error retrieving nomination');
    }
  },

  // Admin functions - download individual nomination PDF
  downloadNominationPdf: async (nominationId, token) => {
    try {
      // Get the nomination data first
      const response = await axios.get(`${baseURL}/${nominationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.data || !response.data.nomination) {
        throw new Error('Failed to retrieve nomination data');
      }
      
      // Then generate and download the PDF using the correct function
      return await nominationService.generateAndDownloadNominationPdf(response.data.nomination);
    } catch (error) {
      console.error('Error downloading nomination PDF:', error);
      throw error;
    }
  },

  // Admin functions - export all nominations to Excel
  exportNominationsToExcel: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sector) queryParams.append('sector', filters.sector);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      // Make the request with blob response type for direct download
      const response = await axios.get(`${pdfURL}/export-nominations-excel${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nominations_export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting nominations to Excel:', error);
      throw error;
    }
  },

  // Admin functions - export all nominations to PDF
  exportNominationsToPdf: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sector) queryParams.append('sector', filters.sector);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      // Make the request with blob response type for direct download
      const response = await axios.get(`${pdfURL}/export-nominations-pdf${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `nominations_export_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting nominations to PDF:', error);
      throw error;
    }
  },
  
  // Check if there are any filtered nominations before exporting
  checkFilteredNominations: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.sector) queryParams.append('sector', filters.sector);
      
      // Format dates to ISO string format (YYYY-MM-DD)
      if (filters.startDate) {
        const formattedStartDate = filters.startDate.split('T')[0]; // Extract just the YYYY-MM-DD part
        queryParams.append('startDate', formattedStartDate);
      }
      if (filters.endDate) {
        const formattedEndDate = filters.endDate.split('T')[0]; // Extract just the YYYY-MM-DD part
        queryParams.append('endDate', formattedEndDate);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      // Make a request to check if there are any nominations matching the filter criteria
      const response = await axios.get(`${baseURL}/filtered-count${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data?.count > 0;
    } catch (error) {
      console.error('Error checking filtered nominations:', error);
      // Return false instead of throwing an error
      return false;
    }
  }
};

export default nominationService; 
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const baseURL = `${API_BASE_URL}/api/members`;
// Fallback URL for when local server is not available
const fallbackURL = 'https://api.rashtriyakisanmanch.com/api/members';
const pdfURL = `${API_BASE_URL}/api/pdf`;
const fallbackPdfURL = 'https://api.rashtriyakisanmanch.com/api/pdf';

const memberService = {
  // Register a new member
  registerMember: async (memberData) => {
    // For demo purposes, return a mock successful response when API is not available
    try {
      const formData = new FormData();
      formData.append('name', memberData.name);
      formData.append('village', memberData.village);
      formData.append('city', memberData.city);
      formData.append('phoneNumber', memberData.phoneNumber);
      formData.append('details', memberData.details);
      formData.append('membershipType', 'General Member');

      // If document is provided, append it
      if (memberData.documentPhoto) {
        formData.append('documentPhoto', memberData.documentPhoto);
        formData.append('documentType', memberData.documentType || 'Other');
      }

      try {
        // First try with the configured API URL
        const response = await axios.post(baseURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (localError) {
        console.log("Local API not available, trying production API...");
        try {
          // If local API fails, try the production API
          const prodResponse = await axios.post(fallbackURL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return prodResponse.data;
        } catch (prodError) {
          // If both APIs fail, use mock data for demo
          console.log("Production API also not available, using mock data for demo");
          const timestamp = Date.now().toString().slice(-6);
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return {
            success: true,
            message: "Registration successful (demo mode)",
            member: {
              id: "demo_" + Date.now().toString().slice(-6),
              applicationId: `RKM${timestamp}${random}`,
              name: memberData.name,
              village: memberData.village,
              city: memberData.city,
              phoneNumber: memberData.phoneNumber,
              details: memberData.details,
              membershipType: 'General Member',
              documentType: memberData.documentType || 'Not Provided',
              status: 'Pending',
              createdAt: new Date().toISOString()
            }
          };
        }
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error registering member');
    }
  },

  // Register a youth leadership program member
  registerYouthMember: async (youthData) => {
    const formData = new FormData();
    formData.append('name', youthData.name);
    formData.append('village', youthData.village);
    formData.append('city', youthData.city);
    formData.append('phoneNumber', youthData.phoneNumber);
    formData.append('membershipType', 'Kisan Youth Leadership Program');
    
    // Additional youth leadership specific fields
    if (youthData.age) formData.append('age', youthData.age);
    if (youthData.education) formData.append('education', youthData.education);
    if (youthData.experience) formData.append('experience', youthData.experience);
    
    // If document is provided, append it
    if (youthData.documentPhoto) {
      formData.append('documentPhoto', youthData.documentPhoto);
      formData.append('documentType', youthData.documentType || 'Other');
    }

    try {
      // First try with the configured API URL
      const response = await axios.post(baseURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (localError) {
      try {
        // If local API fails, try the production API
        const prodResponse = await axios.post(fallbackURL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return prodResponse.data;
      } catch (prodError) {
        // If both APIs fail, return mock data for demo
        console.log("API not available, using mock data for demo");
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return {
          success: true,
          message: "Youth registration successful (demo mode)",
          member: {
            id: "demo_" + Date.now().toString().slice(-6),
            applicationId: `KLP${timestamp}${random}`,
            name: youthData.name,
            village: youthData.village,
            city: youthData.city,
            phoneNumber: youthData.phoneNumber,
            membershipType: 'Kisan Youth Leadership Program',
            age: youthData.age || '',
            education: youthData.education || '',
            experience: youthData.experience || '',
            documentType: youthData.documentType || 'Not Provided',
            status: 'Pending',
            createdAt: new Date().toISOString()
          }
        };
      }
    }
  },

  // Generate and download application receipt
  downloadApplicationReceipt: async (memberData) => {
    try {
      // Prepare data for PDF generation
      const pdfData = {
        name: memberData.name,
        village: memberData.village,
        city: memberData.city,
        phoneNumber: memberData.phoneNumber,
        applicationId: memberData.applicationId,
        membershipType: memberData.membershipType,
        applicationDate: memberData.createdAt || memberData.applicationDate || new Date(),
        status: memberData.status || 'Pending',
        age: memberData.age,
        education: memberData.education,
        experience: memberData.experience
      };

      // First try with the configured API URL with blob response type for direct download
      try {
        const response = await axios.post(`${pdfURL}/application-receipt`, pdfData, {
          responseType: 'blob'
        });
        
        // Create a download link and trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `application_receipt_${memberData.applicationId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
      } catch (localError) {
        console.log("Local PDF API not available, trying production API...");
        try {
          // If local API fails, try the production API
          const prodResponse = await axios.post(`${fallbackPdfURL}/application-receipt`, pdfData, {
            responseType: 'blob'
          });
          
          // Create a download link and trigger the download
          const url = window.URL.createObjectURL(new Blob([prodResponse.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `application_receipt_${memberData.applicationId}.pdf`);
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
      console.error("Error downloading application receipt:", error);
      throw error;
    }
  },

  // Admin functions - get all member applications
  getMemberApplications: async (token) => {
    try {
      try {
        const response = await axios.get(baseURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Check if we have valid data
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response.data && Array.isArray(response.data.members)) {
          return response.data.members;
        } else if (response.data) {
          console.warn('Unexpected data format received from member API:', response.data);
          return [];
        }
        
        return [];
      } catch (localError) {
        console.log("Local API not available, trying production API...");
        try {
          // If local API fails, try the production API
          const prodResponse = await axios.get(fallbackURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (prodResponse.data && Array.isArray(prodResponse.data)) {
            return prodResponse.data;
          } else if (prodResponse.data && Array.isArray(prodResponse.data.members)) {
            return prodResponse.data.members;
          }
          
          return [];
        } catch (prodError) {
          console.warn("Production API also not available, returning empty array");
          return [];
        }
      }
    } catch (error) {
      console.error('Error in getMemberApplications:', error);
      // Rather than throw an error, return empty array
      return [];
    }
  },

  // Admin functions - update member application status
  updateMemberStatus: async (memberId, status, notes, token) => {
    try {
      const response = await axios.put(
        `${baseURL}/${memberId}`,
        { status, notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error updating member status');
    }
  },

  // Admin functions - delete member application
  deleteMember: async (memberId, token) => {
    try {
      const response = await axios.delete(
        `${baseURL}/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting member');
    }
  },

  // Admin functions - download individual member PDF
  downloadMemberPdf: async (memberId, token) => {
    try {
      // Get the member data first
      const response = await axios.get(`${baseURL}/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.data || !response.data.member) {
        throw new Error('Failed to retrieve member data');
      }
      
      // Then generate and download the PDF
      return await memberService.downloadApplicationReceipt(response.data.member);
    } catch (error) {
      console.error('Error downloading member PDF:', error);
      throw error;
    }
  },

  // Admin functions - export all members to Excel
  exportMembersToExcel: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.membershipType) queryParams.append('membershipType', filters.membershipType);
      
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
      console.log('Excel export query string:', queryString);
      
      // Make the request with blob response type for direct download
      const response = await axios.get(`${pdfURL}/export-members-excel${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `members_export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting members to Excel:', error);
      throw error;
    }
  },

  // Admin functions - export selected members to Excel
  exportSelectedMembersToExcel: async (memberIds = [], token) => {
    try {
      if (!memberIds.length) {
        throw new Error('No members selected for export');
      }
      
      // Make the request with blob response type for direct download
      const response = await axios.post(
        `${pdfURL}/export-selected-members-excel`,
        { memberIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `selected_members_export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting selected members to Excel:', error);
      throw error;
    }
  },

  // Admin functions - export all youth program applications to Excel
  exportYouthToExcel: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      
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
      console.log('Youth Excel export query:', queryString);
      
      // Make the request with blob response type for direct download
      const response = await axios.get(`${pdfURL}/export-youth-excel${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `youth_program_export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting youth applications to Excel:', error);
      throw error;
    }
  },

  // Admin functions - export all members to PDF
  exportMembersToPdf: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.membershipType) queryParams.append('membershipType', filters.membershipType);
      
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
      console.log('PDF export query string:', queryString);
      
      // Make the request with blob response type for direct download
      const response = await axios.get(`${pdfURL}/export-members-pdf${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `members_export_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting members to PDF:', error);
      throw error;
    }
  },

  // Admin functions - export selected members to PDF
  exportSelectedMembersToPdf: async (memberIds = [], token) => {
    try {
      if (!memberIds.length) {
        throw new Error('No members selected for export');
      }
      
      // Make the request with blob response type for direct download
      const response = await axios.post(
        `${pdfURL}/export-selected-members-pdf`,
        { memberIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `selected_members_export_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting selected members to PDF:', error);
      throw error;
    }
  },

  // Admin functions - export all youth program applications to PDF
  exportYouthToPdf: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      
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
      console.log('Youth PDF export query:', queryString);
      
      // Make the request with blob response type for direct download
      const response = await axios.get(`${pdfURL}/export-youth-pdf${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `youth_program_export_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting youth applications to PDF:', error);
      throw error;
    }
  },
  
  // Check if there are any filtered members before exporting
  checkFilteredMembers: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.membershipType) queryParams.append('membershipType', filters.membershipType);
      
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
      
      // Make a request to check if there are any members matching the filter criteria
      const response = await axios.get(`${baseURL}/filtered-count${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data?.count > 0;
    } catch (error) {
      console.error('Error checking filtered members:', error);
      // Return false instead of throwing an error
      return false;
    }
  },
  
  // Check if there are any filtered youth applications before exporting
  checkFilteredYouth: async (filters = {}, token) => {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      
      // Format dates to ISO string format (YYYY-MM-DD)
      if (filters.startDate) {
        const formattedStartDate = filters.startDate.split('T')[0]; // Extract just the YYYY-MM-DD part
        queryParams.append('startDate', formattedStartDate);
      }
      if (filters.endDate) {
        const formattedEndDate = filters.endDate.split('T')[0]; // Extract just the YYYY-MM-DD part
        queryParams.append('endDate', formattedEndDate);
      }
      
      queryParams.append('membershipType', 'Kisan Youth Leadership Program');
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      // Make a request to check if there are any youth applications matching the filter criteria
      const response = await axios.get(`${baseURL}/filtered-count${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data?.count > 0;
    } catch (error) {
      console.error('Error checking filtered youth applications:', error);
      // Return false instead of throwing an error
      return false;
    }
  }
};

export default memberService; 
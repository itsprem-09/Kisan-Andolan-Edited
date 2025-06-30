import api from './api';

const API_URL = '/api/banner';

const getBanners = () => {
  return api.get(API_URL);
};

const createBanners = (banners) => {
  return api.post(`${API_URL}/upload`, banners);
};

const editBanner = (publicId, banner) => {
  return api.put(`${API_URL}/${encodeURIComponent(publicId)}`, banner);
};

const deleteBanner = (publicId) => {
  return api.delete(`${API_URL}/${encodeURIComponent(publicId)}`);
};

const bannerService = {
  getBanners,
  createBanners,
  editBanner,
  deleteBanner
};

export default bannerService;
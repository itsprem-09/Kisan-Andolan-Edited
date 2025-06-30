import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import bannerService from 'services/bannerService';
import Icon from 'components/AppIcon';

const HeroBanner = () => {
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
        setLoading(true);
      const res = await bannerService.getBanners();
      setImages(res.data);
    } catch (err) {
      console.error('Error fetching banners:', err);
    }finally{
        setLoading(false);
    }
  };

  const openModal = (image = null) => {
    setEditingImage(image);
    setModalOpen(true);
    setSelectedFiles([]);
  };

  const closeModal = () => {
    setEditingImage(null);
    setModalOpen(false);
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    try {
        setLoading(true);
      if (editingImage) {
        if (selectedFiles.length > 0) {
          formData.append('image', selectedFiles[0]);
          await bannerService.editBanner(editingImage.public_id, formData);
        }
      } else {
        selectedFiles.forEach((file) => {
          formData.append('gallery', file);
        });
        await bannerService.createBanners(formData);
      }

      fetchImages();
      closeModal();
    } catch (err) {
      console.error('Upload error:', err);
    }finally{
        setLoading(false);
    }
  };

  const handleDelete = async (public_id) => {
    try {
        setLoading(true);
      await bannerService.deleteBanner(public_id);
      fetchImages();
    } catch (err) {
      console.error('Delete error:', err);
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Hero Banner</h2>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Banner
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
              onClick={closeModal}
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editingImage ? 'Edit Image' : 'Upload Images'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                name={editingImage ? 'image' : 'gallery'}
                multiple={!editingImage}
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingImage ? ( !loading ? 'Update' : 'Updating..') : ( !loading ? 'Upload' : 'Uploading..')}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Image Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {images?.map((img) => (
          <motion.div
            key={img._id}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white"
          >
            <img
              src={img.url}
              alt="banner"
              className="w-full h-60 object-cover"
            />
            <div className="flex justify-between items-center p-3 bg-gray-50">
              <button
                onClick={() => openModal(img)}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Icon name="pencil" size={18} /> {!loading ? "Edit" : "Editing.."}
              </button>
              <button
                onClick={() => handleDelete(img.public_id)}
                disabled={loading}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Icon name="trash" size={18} /> {!loading ? "Delete" : "Deleting.."}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bannerService from 'services/bannerService';
import { useLanguage } from '../../../contexts/LanguageContext';
import TranslateText from '../../../components/TranslateText';

const variants = {
  enter: (dir) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 1 }
  },
  exit: (dir) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 1 }
  })
};

const HeroSection = ({ onMemberRegistration, onYouthLeadership }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [banners, setBanners] = useState([]);

  // Fetch banners
  useEffect(() => {
    const getBanners = async () => {
      const res = await bannerService.getBanners();
      setBanners(res.data || []);
    };
    getBanners();
  }, []);

  // Auto slide once banners are loaded
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);


  return (
    <div className='w-full overflow-hidden pt-24'>
      <section className="relative h-[88vh]">
        <AnimatePresence custom={direction}>
          {banners.length > 0 && banners[index] && (
            <motion.img
              key={banners[index]._id}
              src={banners[index].url}
              alt={`Banner ${index + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default HeroSection;

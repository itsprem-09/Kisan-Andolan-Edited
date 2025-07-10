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

const HeroSection = ({ onMemberRegistration, onYouthLeadership, onNominationForm }) => {
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

        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-4 px-4">
          <button
            onClick={onMemberRegistration}
            className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <TranslateText translationKey="becomeMember">Become a Member</TranslateText>
          </button>
          
          <button
            onClick={onYouthLeadership}
            className="bg-secondary hover:bg-secondary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <TranslateText translationKey="youthLeadership">Youth Leadership Program</TranslateText>
          </button>
          
          <button
            onClick={onNominationForm}
            className="bg-accent-orange hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <TranslateText translationKey="nominateHero">Nominate for Kisan Puraskar</TranslateText>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;

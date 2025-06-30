import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import HeroSection from './components/HeroSection';
import MissionHighlights from './components/MissionHighlights';
import MilestonesSection from './components/MilestonesSection';
import TeamSection from './components/TeamSection';
import OurVisionSection from './components/OurVisionSection';
import Footer from './components/Footer';

const Homepage = () => {
  const navigate = useNavigate();

  const handleMemberRegistration = () => {
    navigate('/member-registration-modal');
  };

  const handleYouthLeadership = () => {
    navigate('/youth-leadership-program-modal');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Language Toggle */}
      <Header />

      {/* Hero Section */}
      <HeroSection 
        onMemberRegistration={handleMemberRegistration}
        onYouthLeadership={handleYouthLeadership}
      />

      {/* Mission Highlights */}
      <MissionHighlights />

      {/* Milestones Section */}
      <MilestonesSection />

      {/* Our Vision Section */}
      <OurVisionSection />

      {/* Team Section */}
      <TeamSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
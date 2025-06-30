import React, { useState } from 'react';
import Breadcrumb from 'components/ui/Breadcrumb';
import TabNavigation from './components/TabNavigation';
import MediaCarousel from './components/MediaCarousel';
import ProgramsCarousel from './components/ProgramsCarousel';
import UpcomingProjectsCarousel from './components/UpcomingProjectsCarousel';
import ContentModal from './components/ContentModal';
import Icon from 'components/AppIcon';
import MemberRegistrationModal from '../member-registration-modal';
import YouthLeadershipProgramModal from '../youth-leadership-program-modal';
import { useLanguage } from 'contexts/LanguageContext';

const OurVisionMissionPage = () => {
  const [activeTab, setActiveTab] = useState('media');
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMemberRegistration, setShowMemberRegistration] = useState(false);
  const [showYouthProgram, setShowYouthProgram] = useState(false);
  const { getTranslation } = useLanguage();

  const tabs = [
    { id: 'media', label: getTranslation('media'), icon: 'Camera' },
    { id: 'programs', label: getTranslation('programs'), icon: 'Target' },
    { id: 'upcoming', label: getTranslation('projects'), icon: 'Calendar' }
  ];

  const handleCardClick = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const renderActiveCarousel = () => {
    switch (activeTab) {
      case 'media':
        return <MediaCarousel onCardClick={handleCardClick} />;
      case 'programs':
        return <ProgramsCarousel onCardClick={handleCardClick} />;
      case 'upcoming':
        return <UpcomingProjectsCarousel onCardClick={handleCardClick} />;
      default:
        return <MediaCarousel onCardClick={handleCardClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb />

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <Icon name="Eye" size={32} color="white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            {getTranslation('visionMission')}
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto font-body">
            {getTranslation('visionMissionDesc')}
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Vision Card */}
          <div className="card-elevated">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <Icon name="Eye" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">{getTranslation('ourVisionTitle')}</h2>
            </div>
            <ul className="list-disc list-inside text-text-secondary leading-relaxed font-body space-y-2">
              {getTranslation('visionContent').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Mission Card */}
          <div className="card-elevated">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                <Icon name="Target" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">{getTranslation('ourMissionTitle')}</h2>
            </div>
            <ul className="list-disc list-inside text-text-secondary leading-relaxed font-body space-y-2">
              {getTranslation('missionContent').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Political Mission Card */}
          <div className="card-elevated md:col-span-2 max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                <Icon name="Users" size={24} color="white" />
              </div>
              <h2 className="text-2xl font-heading font-semibold text-primary">{getTranslation('ourPoliticalMission')}</h2>
            </div>
            <ul className="list-disc list-inside text-text-secondary leading-relaxed font-body space-y-2">
              {getTranslation('politicalMissionContent').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Area */}
        <div className="mt-8">
          {renderActiveCarousel()}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center">
          <div className="card bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl">
            <h3 className="text-2xl font-heading font-semibold mb-4">
              {getTranslation('joinOurMovement')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {getTranslation('joinMovementVision')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowMemberRegistration(true)}
                className="bg-white text-primary px-6 py-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                {getTranslation('becomeAMember')}
              </button>
              <button
                onClick={() => setShowYouthProgram(true)}
                className="border-2 border-white text-white px-6 py-3 rounded-md font-medium transition-all duration-200 hover:bg-white hover:text-primary focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                {getTranslation('youthLeadershipProgram')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Modal */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        content={modalContent}
      />

      {/* Member Registration Modal */}
      {showMemberRegistration && <MemberRegistrationModal onClose={() => setShowMemberRegistration(false)} />}

      {/* Youth Leadership Program Modal */}
      {showYouthProgram && <YouthLeadershipProgramModal onClose={() => setShowYouthProgram(false)} />}
    </div>
  );
};

export default OurVisionMissionPage;
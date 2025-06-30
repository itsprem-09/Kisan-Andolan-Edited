import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';

const TeamStructure = () => {
  const [activeTab, setActiveTab] = useState('structure');
  const { getTranslation, language } = useLanguage();

  // Manual translations for Organizational Framework tab descriptions
  const organizationalFrameworkContent = {
    en: {
      description: "Our organizational structure is designed to ensure effective governance, clear accountability, and maximum impact across all our initiatives. We operate with a balance of centralized leadership and decentralized implementation to maintain both strategic coherence and local adaptability.",
      governanceDesc: "Our governance framework is built on principles of transparency, accountability, and participatory decision-making. Through regular elections, audits, and inclusive processes, we ensure the organization remains true to its mission and responsive to the farming community's evolving needs."
    },
    hi: {
      description: "हमारी संगठनात्मक संरचना प्रभावी शासन, स्पष्ट जवाबदेही और हमारे सभी पहलों में अधिकतम प्रभाव सुनिश्चित करने के लिए डिज़ाइन की गई है। हम रणनीतिक सामंजस्य और स्थानीय अनुकूलन दोनों को बनाए रखने के लिए केंद्रीकृत नेतृत्व और विकेंद्रीकृत कार्यान्वयन के संतुलन के साथ काम करते हैं।",
      governanceDesc: "हमारा शासन ढांचा पारदर्शिता, जवाबदेही और सहभागी निर्णय लेने के सिद्धांतों पर आधारित है। नियमित चुनावों, ऑडिट और समावेशी प्रक्रियाओं के माध्यम से, हम यह सुनिश्चित करते हैं कि संगठन अपने मिशन के प्रति सच्चा रहे और कृषि समुदाय की विकासशील जरूरतों के प्रति उत्तरदायी रहे।"
    }
  };

  const organizationalStructure = [
    {
      role: getTranslation('boardOfDirectors'),
      members: 7,
      description: getTranslation('boardDescription'),
      responsibilities: [
        getTranslation('policyApproval'), 
        getTranslation('financialOversight'), 
        getTranslation('strategicPlanning'), 
        getTranslation('leadershipAppointment')
      ],
      icon: 'Briefcase'
    },
    {
      role: getTranslation('executiveCommittee'),
      members: 5,
      description: getTranslation('execCommitteeDescription'),
      responsibilities: [
        getTranslation('operationsManagement'), 
        getTranslation('programExecution'), 
        getTranslation('staffSupervision'), 
        getTranslation('budgetAdmin')
      ],
      icon: 'Users'
    },
    {
      role: getTranslation('advisoryCouncil'),
      members: 12,
      description: getTranslation('advisoryDescription'),
      responsibilities: [
        getTranslation('technicalAdvice'), 
        getTranslation('researchGuidance'), 
        getTranslation('policyRecommendations'), 
        getTranslation('industryConnections')
      ],
      icon: 'Lightbulb'
    },
    {
      role: getTranslation('regionalCoordinators'),
      members: 18,
      description: getTranslation('coordinatorsDescription'),
      responsibilities: [
        getTranslation('regionalImplementation'), 
        getTranslation('localPartnerships'), 
        getTranslation('farmerEngagement'), 
        getTranslation('feedbackCollection')
      ],
      icon: 'Map'
    },
    {
      role: getTranslation('programTeams'),
      members: 35,
      description: getTranslation('programTeamsDescription'),
      responsibilities: [
        getTranslation('trainingDelivery'), 
        getTranslation('resourceDevelopment'), 
        getTranslation('impactAssessment'), 
        getTranslation('innovationTesting')
      ],
      icon: 'Target'
    }
  ];

  const governanceFramework = {
    principles: [
      getTranslation('principleTransparency'),
      getTranslation('principleInclusion'),
      getTranslation('principleAccountability'),
      getTranslation('principleIntegrity'),
      getTranslation('principleSustainability')
    ],
    processes: [
      getTranslation('processAnnualMeeting'),
      getTranslation('processQuarterlyBoard'),
      getTranslation('processElection'),
      getTranslation('processFinancialAudits'),
      getTranslation('processGrievance')
    ]
  };

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
        {getTranslation('organizationalFramework')}
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-8">
        <button
          onClick={() => setActiveTab('structure')}
          className={`pb-3 px-4 text-lg font-medium relative ${activeTab === 'structure' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
        >
          {getTranslation('organizationalStructure')}
          {activeTab === 'structure' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`pb-3 px-4 text-lg font-medium relative ${activeTab === 'governance' ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
        >
          {getTranslation('governanceFramework')}
          {activeTab === 'governance' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
        </button>
      </div>
      
      {/* Structure Content */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          <div className="mb-6">
            <p className="text-text-secondary">
              {organizationalFrameworkContent[language]?.description || organizationalFrameworkContent['en'].description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizationalStructure.map((item, index) => (
              <div key={index} className="card hover:shadow-md transition-smooth">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={24} color="#4a7c59" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-primary mb-1">{item.role}</h3>
                    <p className="text-sm text-text-secondary mb-3">
                      <span className="font-medium">{item.members}</span> {getTranslation('members')} | {item.description}
                    </p>
                    <div className="space-y-1">
                      {item.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-text-secondary">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Organizational Chart */}
          <div className="p-6 bg-surface rounded-xl shadow-md mt-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-semibold text-primary">
                {getTranslation('organizationalChart')}
              </h3>
              <p className="text-text-secondary">
                {getTranslation('orgChartDescription')}
              </p>
            </div>
            
            <div className="relative">
              {/* This would be a more detailed org chart in the actual implementation */}
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-48 p-3 bg-primary text-white rounded-lg text-center mb-4">
                    <div className="font-medium">{getTranslation('boardOfDirectors')}</div>
                  </div>
                  
                  <Icon name="ArrowDown" size={24} className="mb-4 text-primary" />
                  
                  <div className="w-48 p-3 bg-secondary text-white rounded-lg text-center mb-4">
                    <div className="font-medium">{getTranslation('executiveCommittee')}</div>
                  </div>
                  
                  <Icon name="ArrowDown" size={24} className="mb-4 text-primary" />
                  
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="p-3 bg-accent text-secondary rounded-lg text-center">
                      <div className="font-medium">{getTranslation('programTeams')}</div>
                    </div>
                    <div className="p-3 bg-accent text-secondary rounded-lg text-center">
                      <div className="font-medium">{getTranslation('regionalCoordinators')}</div>
                    </div>
                    <div className="p-3 bg-accent text-secondary rounded-lg text-center">
                      <div className="font-medium">{getTranslation('advisoryCouncil')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Governance Content */}
      {activeTab === 'governance' && (
        <div className="space-y-8">
          <div className="mb-6">
            <p className="text-text-secondary">
              {organizationalFrameworkContent[language]?.governanceDesc || organizationalFrameworkContent['en'].governanceDesc}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Governance Principles */}
            <div className="card-elevated">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Shield" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                    {getTranslation('governancePrinciples')}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {getTranslation('governancePrinciplesDesc')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {governanceFramework.principles.map((principle, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                      <span className="font-medium text-sm">{index + 1}</span>
                    </div>
                    <span className="text-text-primary">{principle}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Governance Processes */}
            <div className="card-elevated">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Settings" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                    {getTranslation('governanceProcesses')}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {getTranslation('governanceProcessesDesc')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {governanceFramework.processes.map((process, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 text-secondary mt-0.5">
                      <Icon name="Check" size={16} />
                    </div>
                    <span className="text-text-primary">{process}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Additional Governance Information */}
          <div className="bg-accent bg-opacity-10 rounded-xl p-6 border-l-4 border-accent">
            <h3 className="text-xl font-heading font-semibold text-primary mb-4">
              {getTranslation('transparencyCommitment')}
            </h3>
            <p className="text-text-secondary mb-4">
              {getTranslation('transparencyCommitmentDesc')}
            </p>
            <div className="flex items-center space-x-2">
              <Icon name="ExternalLink" size={16} className="text-primary" />
              <a href="#" className="text-primary hover:underline font-medium">
                {getTranslation('viewGovernanceDocuments')}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamStructure;
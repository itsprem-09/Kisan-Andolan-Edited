import React, { createContext, useState, useContext, useEffect } from 'react';
import { translateText, batchTranslate } from '../utils/translateApi';

// Create context
const LanguageContext = createContext();

// Static translations for UI elements
const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    visionMission: 'Our Vision & Mission',
    informationCenter: 'Information Center',
    timeline: 'Timeline',
    
    // Actions
    becomeMember: 'Become a Member',
    learnMore: 'Learn More',
    readMore: 'Read More',
    viewAll: 'View All',
    joinNow: 'Join Now',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    
    // Homepage
    heroTitle: 'Supporting Farmers Across India',
    heroSubtitle: 'Join our movement for agricultural rights',
    ourVision: 'Our Vision',
    ourMission: 'Our Mission',
    recentMilestones: 'Recent Milestones',
    mediaCoverage: 'Media Coverage',
    meetOurTeam: 'Meet Our Team',
    
    // Footer
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    quickLinks: 'Quick Links',
    subscribe: 'Subscribe to Newsletter',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
    copyright: 'All rights reserved',
    
    // About Page
    ourStory: 'Our Story : "Carrying the Legacy Forward"',
    ourTeam: 'Our Team',
    coreValues: 'Pulse of our politics',
    ourImpact: 'Our Impact',
    founders: 'Founders',
    partnerships: 'Partnerships',
    aboutOurMovement: 'About Our Movement',
    empoweringRuralIndia: 'Empowering Rural India',
    grassrootsTransformation: 'Two decades of grassroots agricultural transformation',
    aboutPageDesc: "Since 2003, Rashtriya Kisan Manch has stood as a people's platform—committed to fighting for farmers' rights, ensuring fair income, and reclaiming dignity for rural India. We work to shape policies, raise voices, and build a just, inclusive future rooted in equality, sustainability, and constitutional values.",
    joinOurMovement: 'Join Our Movement',
    joinMovementDesc: 'Be part of a growing community dedicated to transforming agriculture in India. Together, we can build a more sustainable and prosperous future for our farmers.',
    aboutBecomeAMember: 'Become a Member',
    aboutKisanLeadershipProgram: 'Kisan Leadership Program',
    communityFirst: 'Rashtriya Kisan Manch vs. Education Mafia',
    communityFirstDesc: 'Rashtriya Kisan Manch has always stood for justice—not just for farmers,',
    sustainability: 'Life Over Bills',
    sustainabilityDesc: 'nd pressuring state and central governments to act decisively. We are also working with educators,',
    socialJustice: 'Wages Over Worship',
    socialJusticeDesc: "In today's political climate, the real struggles of ordinary Indians—especially farmers,",
    innovation: 'Cost Without Care',
    innovationDesc: 'Across India, farmers are losing crops to floods and droughts, patients in rural areas wait hours for a doctor,',
    headquarters: 'Headquarters',
    regionalOffices: 'Regional Offices',
    aboutNorthIndia: 'North India',
    aboutSouthIndia: 'South India',
    aboutEastIndia: 'East India',
    aboutWestIndia: 'West India',
    connectWithUs: 'Connect With Us',
    
    // Vision & Mission Page
    visionMissionDesc: 'Discover our commitment to agricultural excellence, community empowerment, and sustainable farming practices that drive positive change across rural India.',
    ourVisionTitle: 'Our Vision',
    ourMissionTitle: 'Our Mission',
    ourPoliticalMission: 'Our Political Mission',
    joinMovementVision: 'Be part of the change you want to see in agriculture. Together, we can build a stronger farming community.',
    media: 'Media',
    programs: 'Programs',
    projects: 'Projects',
    youthLeadershipProgram: 'Youth Leadership Program',
    
    // Information Center
    informationCenterTitle: 'Information Center',
    informationCenterDesc: 'Access comprehensive agricultural resources, government schemes, and educational content to enhance your farming knowledge and productivity.',
    searchResources: 'Search Resources',
    searchPlaceholder: 'Search for schemes, guides, resources...',
    category: 'Category',
    allCategories: 'All Categories',
    subsidies: 'Subsidies',
    certification: 'Certification',
    insurance: 'Insurance',
    seasonal: 'Seasonal',
    sustainable: 'Sustainable',
    weather: 'Weather',
    pdfGuides: 'PDF Guides',
    videos: 'Videos',
    infographics: 'Infographics',
    policy: 'Policy',
    market: 'Market',
    events: 'Events',
    region: 'Region',
    allRegions: 'All Regions',
    national: 'National',
    infoNorthIndia: 'North India',
    infoSouthIndia: 'South India',
    infoEastIndia: 'East India',
    infoWestIndia: 'West India',
    centralIndia: 'Central India',
    sortBy: 'Sort By',
    relevance: 'Relevance',
    date: 'Date',
    engagement: 'Engagement',
    governmentSchemes: 'Government Schemes',
    agriculturalResources: 'Agricultural Resources',
    educationalMaterials: 'Educational Materials',
    newsAndUpdates: 'News & Updates',
    noContent: 'No content available',
    
    // Organizational Framework Translations
    organizationalFramework: 'Organizational Framework',
    organizationalStructure: 'Organizational Structure',
    governanceFramework: 'Governance Framework',
    organizationalChart: 'Organizational Chart',
    orgChartDescription: 'An overview of our organizational structure and reporting relationships',
    
    // Organizational Roles and Descriptions
    boardOfDirectors: 'Board of Directors',
    executiveCommittee: 'Executive Committee',
    advisoryCouncil: 'Advisory Council',
    regionalCoordinators: 'Regional Coordinators',
    programTeams: 'Program Teams',
    members: 'Members',
    
    // Role Descriptions
    boardDescription: 'Provides strategic direction and governance oversight',
    execCommitteeDescription: 'Manages daily operations and program implementation',
    advisoryDescription: 'Provides technical expertise and policy guidance',
    coordinatorsDescription: 'Coordinates initiatives and activities at the regional level',
    programTeamsDescription: 'Delivers field-based interventions and training programs',
    
    // Responsibilities
    policyApproval: 'Policy Approval',
    financialOversight: 'Financial Oversight',
    strategicPlanning: 'Strategic Planning',
    leadershipAppointment: 'Leadership Appointment',
    operationsManagement: 'Operations Management',
    programExecution: 'Program Execution',
    staffSupervision: 'Staff Supervision',
    budgetAdmin: 'Budget Administration',
    technicalAdvice: 'Technical Advice',
    researchGuidance: 'Research Guidance',
    policyRecommendations: 'Policy Recommendations',
    industryConnections: 'Industry Connections',
    regionalImplementation: 'Regional Implementation',
    localPartnerships: 'Local Partnerships',
    farmerEngagement: 'Farmer Engagement',
    feedbackCollection: 'Feedback Collection',
    trainingDelivery: 'Training Delivery',
    resourceDevelopment: 'Resource Development',
    impactAssessment: 'Impact Assessment',
    innovationTesting: 'Innovation Testing',
    
    // Governance Framework
    governancePrinciples: 'Governance Principles',
    governancePrinciplesDesc: 'Core principles that guide our governance philosophy',
    principleTransparency: 'Transparency and Openness',
    principleInclusion: 'Inclusion and Diversity',
    principleAccountability: 'Accountability and Oversight',
    principleIntegrity: 'Integrity and Ethical Conduct',
    principleSustainability: 'Sustainability and Long-term Thinking',
    
    governanceProcesses: 'Governance Processes',
    governanceProcessesDesc: 'Institutional processes that put our principles into action',
    processAnnualMeeting: 'Annual Member Convention',
    processQuarterlyBoard: 'Quarterly Board Meetings',
    processElection: 'Transparent Leadership Elections',
    processFinancialAudits: 'Annual Financial Audits',
    processGrievance: 'Grievance Redressal System',
    
    transparencyCommitment: 'Transparency Commitment',
    transparencyCommitmentDesc: 'We are committed to making our financial and administrative information transparent and accessible. Our annual reports, financial statements, and key governance documents are publicly available.',
    viewGovernanceDocuments: 'View Governance Documents',
    
    // Timeline Page
    timelineTitle: 'Andolan Timeline',
    timelineDesc: 'Explore the journey and evolution of our movement through key events, milestones, and achievements that have shaped the Kisan Andolan.',
    timelineView: 'Timeline View',
    decadeView: 'Decade View',
    filterByCategory: 'Filter by Category',
    filterByDecade: 'Filter by Decade',
    filterByAchievement: 'Filter by Achievement',
    allDecades: 'All Decades',
    allAchievements: 'All Achievements',
    keyMilestones: 'Key Milestones',
    andolanHistory: 'Andolan History',
    impact: 'Impact',
    gallery: 'Gallery',
    image: 'Image',
    images: 'Images',
    more: 'More',
    viewAllImages: 'View All {count} Images',
    milestone: 'Milestone',
    milestones: 'Milestones',
    eventCount: '{current}/{total} Events',
    activeFilters: 'Active Filters',
    clearAll: 'Clear All',
    navigateLeft: 'Navigate Left',
    navigateRight: 'Navigate Right',
    loadingTimeline: 'Loading timeline data...',
    errorLoadingTimeline: 'Error loading timeline data',
    noTimelineData: 'No timeline data available yet',
    noEventsForDecade: 'No events match the current filters for this decade',
    clearFilters: 'Clear Filters',
    noMatchingDecades: 'No matching decades',
    noDecadesMatchFilters: 'No decades match your current filter criteria',
    resetAllFilters: 'Reset All Filters',
    noDataForFilters: 'No data available with the current filters',
    jumpToDecade: 'Jump to Decade',
    
    // Team and Leadership
    leadership: 'Leadership'
  },
  hi: {
    // Navigation
    home: 'होम',
    about: 'हमारे बारे में',
    visionMission: 'हमारा विजन और मिशन',
    informationCenter: 'सूचना केंद्र',
    timeline: 'समयरेखा',
    
    // Actions
    becomeMember: 'सदस्य बनें',
    learnMore: 'और जानें',
    readMore: 'और पढ़ें',
    viewAll: 'सभी देखें',
    joinNow: 'अभी जुड़ें',
    submit: 'जमा करें',
    search: 'खोज',
    filter: 'फ़िल्टर',
    
    // Timeline Page
    timelineTitle: 'आंदोलन की समयरेखा',
    timelineDesc: 'किसान आंदोलन के इतिहास और विकास को प्रमुख घटनाओं, मील के पत्थरों और उपलब्धियों के माध्यम से जानें।',
    timelineView: 'समयरेखा दृश्य',
    decadeView: 'दशक दृश्य',
    filterByCategory: 'श्रेणी द्वारा फ़िल्टर करें',
    filterByDecade: 'दशक द्वारा फ़िल्टर करें',
    filterByAchievement: 'उपलब्धि द्वारा फ़िल्टर करें',
    allDecades: 'सभी दशक',
    allAchievements: 'सभी उपलब्धियां',
    keyMilestones: 'प्रमुख मील के पत्थर',
    andolanHistory: 'आंदोलन का इतिहास',
    impact: 'प्रभाव',
    gallery: 'गैलरी',
    image: 'छवि',
    images: 'छवियाँ',
    more: 'अधिक',
    viewAllImages: 'सभी {count} छवियां देखें',
    milestone: 'मील का पत्थर',
    milestones: 'मील के पत्थर',
    eventCount: '{current}/{total} घटनाएँ',
    activeFilters: 'सक्रिय फ़िल्टर',
    clearAll: 'सभी साफ़ करें',
    navigateLeft: 'बाएँ जाएं',
    navigateRight: 'दाएं जाएं',
    loadingTimeline: 'समयरेखा डेटा लोड हो रहा है...',
    errorLoadingTimeline: 'समयरेखा डेटा लोड करने में त्रुटि',
    noTimelineData: 'अभी तक कोई समयरेखा डेटा उपलब्ध नहीं है',
    noEventsForDecade: 'इस दशक के लिए वर्तमान फ़िल्टर से कोई घटना मेल नहीं खाती',
    clearFilters: 'फ़िल्टर साफ़ करें',
    noMatchingDecades: 'कोई मेल खाते दशक नहीं',
    noDecadesMatchFilters: 'आपके वर्तमान फ़िल्टर मापदंड से कोई दशक मेल नहीं खाता',
    resetAllFilters: 'सभी फ़िल्टर रीसेट करें',
    noDataForFilters: 'वर्तमान फ़िल्टर के साथ कोई डेटा उपलब्ध नहीं है',
    jumpToDecade: 'दशक पर जाएं'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  // Initialize language from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    setLanguage(savedLang);
    
    // If saved language is not English, translate dynamic content
    if (savedLang !== 'en') {
      translateDynamicContent(savedLang);
    }
  }, []);

  // Function to toggle between languages
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('selectedLang', newLang);
    
    // Translate dynamic content using Google Translate API
    translateDynamicContent(newLang);
  };
  
  // Function to translate dynamic content using Google Translate API
  const translateDynamicContent = async (targetLang) => {
    if (targetLang === 'en') {
      // Reset to English (original content)
      const elements = document.querySelectorAll('[data-translated="true"]');
      elements.forEach(el => {
        if (el.dataset.originalText) {
          el.textContent = el.dataset.originalText;
          delete el.dataset.originalText;
        }
        delete el.dataset.translated;
      });
      return;
    }
    
    // Only translate elements with the data-translate attribute
    const elements = document.querySelectorAll('[data-translate="true"]');
    if (elements.length === 0) return;
    
    // Collect all texts for batch translation to minimize API calls
    const textsToTranslate = [];
    const elementsMap = [];
    
    elements.forEach(el => {
      if (!el.dataset.originalText) {
        el.dataset.originalText = el.textContent;
      }
      
      // Skip empty elements
      if (el.dataset.originalText.trim() === '') return;
      
      textsToTranslate.push(el.dataset.originalText);
      elementsMap.push(el);
    });
    
    try {
      // Batch translate all texts at once
      const translatedTexts = await batchTranslate(textsToTranslate, targetLang);
      
      // Apply translations
      for (let i = 0; i < elementsMap.length; i++) {
        elementsMap[i].textContent = translatedTexts[i];
        elementsMap[i].dataset.translated = "true";
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  };
  
  // Get translation for a specific key
  const getTranslation = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      getTranslation,
      translateDynamicContent
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext; 
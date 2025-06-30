import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { getAboutContent } from 'services/aboutService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import Modal from 'components/ui/Modal';
import { useLanguage } from '../../../contexts/LanguageContext';

const PartnershipSection = ({ showPartnershipModal, setShowPartnershipModal }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { getTranslation, language } = useLanguage();

  // Manual translations for Partnership Approach
  const partnershipApproachContent = {
    en: {
      title: "Our Partnership Approach",
      description: "At Rashtriya Kisan Manch, we believe that lasting change doesn’t come from speeches alone—it grows from shared action, rooted in trust. That’s why we partner with individuals, communities, institutions, and organizations who believe in the same principles we do: justice, equality, and dignity for every farmer and citizen.",
      values: [
        {
          title: "We listen",
          description: "To the ground realities of farmers, youth, teachers, women, and rural workers.",
          icon: "Target"
        },
        {
          title: "We collaborate",
          description: "With activists, social groups, policy experts, and honest public servants who want real change.",
          icon: "BarChart2"
        },
        {
          title: "We co-create",
          description: "Campaigns, research, legal action, and awareness drives that are built with people, not for them.",
          icon: "User"
        },
        {
          title: "We stay accountable",
          description: "Partnerships are not photo-ops for us—they are shared responsibilities.",
          icon: "Zap"
        }
      ],
      bottom1: "From local youth groups in villages to policy think tanks, from health and education advocates to grassroots panchayats—our strength lies in collective resolve. The Manch invites citizens, civil society, farmer groups, journalists, lawyers, and reform-minded officials to walk with us.",
      bottom2: "Because every voice matters when you're building a nation where the farmer is not just heard, but respected and empowered."
    },
    hi: {
      title: "हमारी भागीदारी की सोच",
      description:
        "राष्ट्रीय किसान मंच में, हम मानते हैं कि स्थायी बदलाव केवल भाषणों से नहीं आता — वह साझा प्रयास से आता है, जो विश्वास पर आधारित होता है। इसलिए हम उन व्यक्तियों, समुदायों, संस्थानों और संगठनों के साथ साझेदारी करते हैं जो हमारे सिद्धांतों में विश्वास करते हैं: न्याय, समानता और हर किसान व नागरिक के लिए गरिमा।",
      values: [
        {
          title: "हम सुनते हैं",
          description: "किसानों, युवाओं, शिक्षकों, महिलाओं और ग्रामीण मजदूरों की ज़मीनी हकीकत को।",
          icon: "Target"
        },
        {
          title: "हम सहयोग करते हैं",
          description: "कार्यकर्ताओं, सामाजिक समूहों, नीति विशेषज्ञों और ईमानदार जनसेवकों के साथ जो असली बदलाव चाहते हैं।",
          icon: "BarChart2"
        },
        {
          title: "हम सह-निर्माण करते हैं",
          description: "अभियान, शोध, कानूनी कार्रवाई और जागरूकता प्रयास जो लोगों के साथ मिलकर बनाए जाते हैं, उनके लिए नहीं।",
          icon: "Refresh"
        },
        {
          title: "हम जवाबदेह रहते हैं",
          description: "हमारे लिए साझेदारी केवल फोटो खिंचवाने का मौका नहीं, बल्कि साझा ज़िम्मेदारी है।",
          icon: "Zap"
        }
      ],
      bottom1: "गांवों के स्थानीय युवा समूहों से लेकर नीति-निर्माण संस्थानों तक, स्वास्थ्य और शिक्षा के पक्षधर संगठनों से लेकर जमीनी पंचायतों तक — हमारी ताकत हमारे सामूहिक संकल्प में है। मंच नागरिकों, सिविल सोसाइटी, किसान समूहों, पत्रकारों, वकीलों और सुधारवादी अधिकारियों को आमंत्रित करता है कि वे हमारे साथ चलें।",
      bottom2: "क्योंकि जब आप एक ऐसा भारत बना रहे हैं जहां किसान सिर्फ सुना ही नहीं, बल्कि सम्मानित और सशक्त भी हो — तब हर आवाज़ मायने रखती है।"
    }
  };

  // Default partner data for fallback
  const defaultPartnerCategories = [
    {
      category: getTranslation('governmentPartners'),
      partners: [
        getTranslation('ministryAgriculture'),
        getTranslation('stateAgriUniversities'),
        getTranslation('indianCouncilAgriResearch'),
        getTranslation('nationalBankAgri')
      ],
      icon: "Landmark"
    },
    {
      category: getTranslation('academicPartners'),
      partners: [
        getTranslation('punjabAgriUniversity'),
        getTranslation('indianAgriResearch'),
        getTranslation('nationalCenterAgriEcon'),
        getTranslation('centerSustainable')
      ],
      icon: "GraduationCap"
    },
    {
      category: getTranslation('ngoPartners'),
      partners: [
        getTranslation('foundationEcological'),
        getTranslation('professionalAssistance'),
        getTranslation('actionFoodProduction'),
        getTranslation('watershedSupport')
      ],
      icon: "Globe"
    },
    {
      category: getTranslation('corporatePartners'),
      partners: [
        getTranslation('nationalAgriCoop'),
        getTranslation('indianFarmersCooperative'),
        getTranslation('agriTechSolutions'),
        getTranslation('ruralFinancial')
      ],
      icon: "Building"
    },
    {
      category: getTranslation('internationalOrgs'),
      partners: [
        getTranslation('foodAgriOrg'),
        getTranslation('internationalFund'),
        getTranslation('globalAlliance'),
        getTranslation('worldBank')
      ],
      icon: "Globe2"
    }
  ];

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await getAboutContent();

        if (response && response.data) {
          setAboutData(response.data);
        }
      } catch (err) {
        console.error('Error fetching about content:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Get partner categories from API or use defaults
  const partnerCategories = aboutData?.partnerCategories && aboutData.partnerCategories.length > 0
    ? aboutData.partnerCategories
    : defaultPartnerCategories;

  // Get partnership approach from manual translations instead of API
  const currentPartnershipApproach = partnershipApproachContent[language] || partnershipApproachContent.en;

  // Handle partnership contact form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle partnership contact form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormError(getTranslation('fillRequiredFields'));
      setSubmitting(false);
      return;
    }

    try {
      // For now, we'll just simulate a successful submission
      // In a real app, you would send this data to your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      setFormSubmitted(true);
      setSubmitting(false);

      // Reset form after 5 seconds
      setTimeout(() => {
        setShowPartnershipModal(false);
        setFormSubmitted(false);
        setFormData({
          name: '',
          email: '',
          organization: '',
          message: ''
        });
      }, 5000);
    } catch (err) {
      console.error('Error submitting partnership form:', err);
      setFormError(getTranslation('formSubmitError'));
      setSubmitting(false);
    }
  };

  // Render partnership contact form
  const renderPartnershipContactForm = () => {
    if (formSubmitted) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Check" size={32} />
          </div>
          <h3 className="text-xl font-heading font-semibold text-primary mb-2">{getTranslation('thankYou')}</h3>
          <p className="text-text-secondary mb-4">
            {getTranslation('formSubmitSuccess')}
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {formError}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-text-primary font-medium mb-1">
            {getTranslation('yourName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-text-primary font-medium mb-1">
            {getTranslation('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-text-primary font-medium mb-1">
            {getTranslation('organization')}
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-text-primary font-medium mb-1">
            {getTranslation('message')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                {getTranslation('submitting')}
              </>
            ) : getTranslation('submit')}
          </button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <section className="my-20">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section className="my-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">
        {getTranslation('partnerships')}
      </h2>

      {/* Partnership Approach Section */}
      <div className="bg-surface rounded-xl p-8 shadow-md mb-12">
        <h3 className="text-2xl font-heading font-semibold text-primary mb-6">
          {currentPartnershipApproach.title}
        </h3>
        <p className="text-text-secondary mb-8">
          {currentPartnershipApproach.description}
        </p>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPartnershipApproach.values.map((value, index) => (
            <div key={index} className="bg-background p-6 rounded-lg hover:shadow-md transition-smooth">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4 text-primary">
                <Icon name={value.icon} size={24} />
              </div>
              <h4 className="text-lg font-heading font-semibold text-primary mb-2">
                {value.title}
              </h4>
              <p className="text-text-secondary text-sm">
                {value.description}
              </p>
            </div>
          ))}
         
        </div>
        <div className='flex flex-col py-2 bg-background mt-4'>
           <p className="text-text-secondary text-sm p-2 bg-opacity-10 rounded-t-lg">{currentPartnershipApproach.bottom1}</p>
          <p className="text-text-secondary text-sm p-2 pt-0 bg-opacity-10 rounded-b-lg">{currentPartnershipApproach.bottom2}</p>
        </div>
      </div>

      {/* Current Partners Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-heading font-semibold text-primary mb-8 text-center">
          {getTranslation('currentPartners')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partnerCategories.map((category, index) => (
            <div key={index} className="card hover:shadow-md transition-smooth">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={category.icon} size={24} color="#4a7c59" />
                </div>
                <div>
                  <h4 className="text-lg font-heading font-semibold text-primary mb-3">{category.category}</h4>
                  <ul className="space-y-2">
                    {category.partners.map((partner, i) => (
                      <li key={i} className="flex items-center space-x-2 text-text-secondary">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                        <span>{partner}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partnership Call to Action */}
      <div className="text-center mt-16">
        <h3 className="text-2xl font-heading font-semibold text-primary mb-4">
          {getTranslation('becomePartner')}
        </h3>
        <p className="text-text-secondary max-w-2xl mx-auto mb-6">
          {getTranslation('partnershipInquiry')}
        </p>
        <button
          onClick={() => setShowPartnershipModal(true)}
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {getTranslation('contactPartnership')}
        </button>
      </div>

      {/* Partnership Modal */}
      <Modal
        isOpen={showPartnershipModal}
        title={getTranslation('partnershipInquiry')}
        onClose={() => setShowPartnershipModal(false)}
      >
        {renderPartnershipContactForm()}
      </Modal>
    </section>
  );
};

export default PartnershipSection;
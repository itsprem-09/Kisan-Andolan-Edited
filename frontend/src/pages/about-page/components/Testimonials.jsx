import React, { useState, useEffect } from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import { getAboutContent } from 'services/aboutService';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { useLanguage } from 'contexts/LanguageContext';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const { language } = useLanguage();
  
  // Default testimonials data for fallback
  const defaultTestimonials = [
    {
      id: 1,
      quote: "Kisan Andolan has transformed our village\'s approach to agriculture. The training on water conservation techniques helped us increase crop yields by 40% while using less water. Their practical, hands-on approach makes complex farming techniques accessible to everyone.",
      hindi_quote: "किसान आंदोलन ने हमारे गांव के कृषि दृष्टिकोण को बदल दिया है। जल संरक्षण तकनीकों पर प्रशिक्षण ने हमें कम पानी का उपयोग करके फसल उपज को 40% तक बढ़ाने में मदद की। उनका व्यावहारिक दृष्टिकोण जटिल कृषि तकनीकों को सभी के लिए सुलभ बनाता है।",
      author: "Ramesh Patel",
      hindi_author: "रमेश पटेल",
      role: "Farmer, Gujarat",
      hindi_role: "किसान, गुजरात",
      image: "https://images.pexels.com/photos/1822095/pexels-photo-1822095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      impact: "40% increase in crop yields",
      hindi_impact: "फसल उपज में 40% की वृद्धि"
    },
    {
      id: 2,
      quote: "As a woman farmer, I faced many challenges in accessing resources and training. The Women in Agriculture program provided not just agricultural knowledge but also leadership training that helped me start a cooperative with 15 other women farmers in my village. Now we negotiate better prices and support each other.",
      hindi_quote: "एक महिला किसान के रूप में, मुझे संसाधनों और प्रशिक्षण तक पहुंचने में कई चुनौतियों का सामना करना पड़ा। कृषि में महिलाओं के कार्यक्रम ने न केवल कृषि ज्ञान बल्कि नेतृत्व प्रशिक्षण भी प्रदान किया, जिसने मुझे अपने गांव में 15 अन्य महिला किसानों के साथ एक सहकारी शुरू करने में मदद की। अब हम बेहतर कीमतों पर बातचीत करते हैं और एक-दूसरे का समर्थन करते हैं।",
      author: "Lakshmi Devi",
      hindi_author: "लक्ष्मी देवी",
      role: "Cooperative Leader, Tamil Nadu",
      hindi_role: "सहकारी नेता, तमिलनाडु",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
      impact: "Founded a 15-member women\'s cooperative",
      hindi_impact: "15 सदस्यीय महिला सहकारी की स्थापना की"
    },
    {
      id: 3,
      quote: "The organic certification assistance from Kisan Andolan was invaluable. They guided us through every step of the complex process and connected us to premium markets. Our income has increased by 65% since transitioning to certified organic farming, and I\'ve been able to send both my children to college.",
      hindi_quote: "किसान आंदोलन से जैविक प्रमाणीकरण सहायता अमूल्य थी। उन्होंने हमें जटिल प्रक्रिया के हर चरण में मार्गदर्शन किया और हमें प्रीमियम बाजारों से जोड़ा। प्रमाणित जैविक खेती में संक्रमण के बाद से हमारी आय 65% बढ़ गई है, और मैं अपने दोनों बच्चों को कॉलेज भेजने में सक्षम हूं।",
      author: "Surinder Singh",
      hindi_author: "सुरिंदर सिंह",
      role: "Organic Farmer, Punjab",
      hindi_role: "जैविक किसान, पंजाब",
      image: "https://images.pexels.com/photos/16963494/pexels-photo-16963494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      impact: "65% income increase through organic certification",
      hindi_impact: "जैविक प्रमाणीकरण के माध्यम से 65% आय वृद्धि"
    },
    {
      id: 4,
      quote: "When I joined the Youth Leadership Program at 22, I had little knowledge about modern agricultural techniques. Three years later, I\'m running a successful agri-tech startup that helps small farmers access weather forecasting data. Kisan Andolan provided mentorship, initial funding, and connections that made this possible.",
      hindi_quote: "जब मैंने 22 साल की उम्र में यूथ लीडरशिप प्रोग्राम ज्वाइन किया, तब मुझे आधुनिक कृषि तकनीकों के बारे में बहुत कम जानकारी थी। तीन साल बाद, मैं एक सफल कृषि-टेक स्टार्टअप चला रहा हूं जो छोटे किसानों को मौसम पूर्वानुमान डेटा तक पहुंचने में मदद करता है। किसान आंदोलन ने मेंटरशिप, प्रारंभिक फंडिंग और कनेक्शन प्रदान किए जिन्होंने इसे संभव बनाया।",
      author: "Arjun Mehta",
      hindi_author: "अर्जुन मेहता",
      role: "Agri-Tech Entrepreneur, Maharashtra",
      hindi_role: "कृषि-टेक उद्यमी, महाराष्ट्र",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop",
      impact: "Founded a successful agri-tech startup",
      hindi_impact: "एक सफल कृषि-टेक स्टार्टअप की स्थापना की"
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

  // Get testimonials from API or use defaults
  const testimonials = aboutData?.testimonials && aboutData.testimonials.length > 0
    ? aboutData.testimonials
    : defaultTestimonials;
    
  // Get community stats from API or use defaults
  const communityStats = aboutData?.communityStats || {
    successStories: 850,
    satisfactionRate: 92,
    incomeIncrease: 45
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  if (loading) {
    return (
      <section className="mb-20">
        <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Community Voices</h2>
        <div className="flex justify-center">
          <LoadingSpinner size={40} />
        </div>
      </section>
    );
  }

  // Get current testimonial content based on selected language
  const getCurrentTestimonialContent = (field) => {
    const testimonial = testimonials[activeIndex];
    if (language === 'hi' && testimonial[`hindi_${field}`]) {
      return testimonial[`hindi_${field}`];
    }
    return testimonial[field];
  }

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Community Voices</h2>
      
      <div className="bg-surface rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Image Column */}
          <div className="lg:col-span-1 h-60 lg:h-auto relative">
            <Image
              src={testimonials[activeIndex].image}
              alt={getCurrentTestimonialContent('author')}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent lg:bg-gradient-to-r flex items-end lg:items-center p-6">
              <div className="text-white">
                <div className="mb-2">
                  <Icon name="MessageCircle" size={24} />
                </div>
                <h3 className="text-xl font-heading font-semibold">{getCurrentTestimonialContent('author')}</h3>
                <p className="opacity-90">{getCurrentTestimonialContent('role')}</p>
                <div className="mt-3 bg-primary bg-opacity-20 px-3 py-1 rounded-full inline-block">
                  <span className="text-sm font-medium">{getCurrentTestimonialContent('impact')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quote Column */}
          <div className="lg:col-span-2 p-8 flex flex-col justify-between">
            <div>
              <Icon name="Quote" size={36} className="text-accent mb-4" />
              <blockquote className="text-lg text-text-primary italic mb-8">
                {getCurrentTestimonialContent('quote')}
              </blockquote>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${activeIndex === index ? 'bg-primary w-6' : 'bg-accent'}`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Testimonial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={24} color="#4a7c59" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">{communityStats.successStories}+</h3>
          <p className="text-text-secondary">Success stories collected</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Star" size={24} color="#4a7c59" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">{communityStats.satisfactionRate}%</h3>
          <p className="text-text-secondary">Program satisfaction rate</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="TrendingUp" size={24} color="#4a7c59" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">{communityStats.incomeIncrease}%</h3>
          <p className="text-text-secondary">Average income increase</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
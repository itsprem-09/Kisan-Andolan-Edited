import React from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';

const FounderProfile = () => {
  const founderDetails = {
    name: "Dr. Rajesh Kumar",
    title: "Founder & Chairman",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    bio: "Dr. Rajesh Kumar is a visionary leader with over 25 years of experience in agricultural development and rural empowerment. He founded Kisan Andolan in 2003 with a mission to transform the lives of farmers through sustainable practices and community-driven initiatives.\n\nWith a Ph.D. in Agricultural Economics from Punjab Agricultural University and extensive field experience across rural India, Dr. Kumar combines academic expertise with practical understanding of farmers' challenges. His approach to agricultural development emphasizes the integration of traditional farming wisdom with modern scientific methods.\n\nUnder his leadership, the organization has grown from a small community group to a nationwide movement impacting over 100,000 farmers across India. His expertise in agricultural economics and policy development has helped shape numerous government programs aimed at improving farmer welfare.",
    achievements: [
      "Founded Kisan Andolan in 2003",
      "Recipient of National Agricultural Innovation Award, 2015",
      "Advised on National Agricultural Policy framework",
      "Published author of 'Sustainable Farming in Modern India'",
      "Led successful advocacy for Minimum Support Price reforms",
      "Established 15 farmer training centers across India"
    ],
    education: [
      { degree: "Ph.D. in Agricultural Economics", institution: "Punjab Agricultural University", year: "1998" },
      { degree: "M.Sc. in Rural Development", institution: "Indian Agricultural Research Institute", year: "1994" },
      { degree: "B.Sc. in Agriculture", institution: "G.B. Pant University of Agriculture & Technology", year: "1992" }
    ],
    socialProfiles: [
      { platform: "Twitter", icon: "Twitter", url: "#" },
      { platform: "LinkedIn", icon: "Linkedin", url: "#" }
    ]
  };

  const formatBio = (bio) => {
    return bio.split('\n\n').map((paragraph, index) => (
      <p key={index} className={index < bio.split('\n\n').length - 1 ? 'mb-4' : ''}>
        {paragraph}
      </p>
    ));
  };

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Our Founder</h2>
      
      <div className="bg-surface rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Founder Image Column */}
          <div className="lg:col-span-1 bg-primary p-8 flex flex-col items-center justify-center text-white">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
              <Image
                src={founderDetails.image}
                alt={founderDetails.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-2xl font-heading font-bold mb-2 text-center">{founderDetails.name}</h3>
            <p className="text-lg opacity-90 mb-6 text-center">{founderDetails.title}</p>
            
            <div className="space-y-4 w-full max-w-xs">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-center">Education</h4>
                <div className="space-y-2">
                  {founderDetails.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{edu.degree}</div>
                      <div className="opacity-80">{edu.institution}, {edu.year}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                {founderDetails.socialProfiles.map((profile, index) => (
                  <a 
                    key={index}
                    href={profile.url}
                    className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-smooth"
                    aria-label={`Follow on ${profile.platform}`}
                  >
                    <Icon name={profile.icon} size={20} color="white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Founder Bio Column */}
          <div className="lg:col-span-2 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-heading font-semibold text-primary mb-4">Biography</h3>
              <div className="text-text-secondary">
                {formatBio(founderDetails.bio)}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-4">Key Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {founderDetails.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Award" size={16} color="#4a7c59" />
                    </div>
                    <span className="text-text-secondary">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border">
              <blockquote className="italic text-lg text-text-primary">
                "Our mission is not just to address the immediate challenges facing farmers, but to transform the entire agricultural ecosystem to ensure sustainable livelihoods and food security for generations to come."
                <footer className="text-sm text-text-secondary mt-2">— Dr. Rajesh Kumar</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderProfile;
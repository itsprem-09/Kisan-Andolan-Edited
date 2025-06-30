import React, { useState, useEffect } from 'react';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import ImpactMetrics from './components/ImpactMetrics';
import TeamStructure from './components/TeamStructure';
import PartnershipSection from './components/PartnershipSection';
import Testimonials from './components/Testimonials';
import MilestoneTimeline from './components/MilestoneTimeline';
import MemberRegistrationModal from '../member-registration-modal';
import YouthLeadershipProgramModal from '../youth-leadership-program-modal';
import { useLanguage } from 'contexts/LanguageContext';
import { Dialog } from '@headlessui/react';
import story1 from '/assets/images/story1.jpg';
import story2 from '/assets/images/story2.jpg';
import story3 from '/assets/images/story3.jpg';

const AboutPage = () => {
  const [showMemberRegistration, setShowMemberRegistration] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showYouthProgram, setShowYouthProgram] = useState(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const { getTranslation, language } = useLanguage();

  // Manual translations for the Our Story section
  const ourStoryContent = {
    en: [
      "Rashtriya Kisan Manch was founded under the vision and leadership of former Prime Minister Shri V.P. Singh, a leader who stood not for power, but for people—especially the poor, the backward, and the forgotten farmer. At a time when farmers were being pushed out of national dialogue, he laid the foundation for a movement that would reclaim their dignity, rights, and income.",
      "By his side was Shekhar Dixit, a young activist who not only shared his ideals but stood with him at every step—listening, learning, and shaping his own path in the same spirit. Today, Shekhar carries forward V.P. Singh’s legacy, not just as a memory, but as a mission—keeping farmers at the center of public policy, and constitutional values at the heart of politics.",
      "The Manch is not a party. It is a people’s platform—rooted in struggle, built on trust, and led by a promise that no farmer will be invisible in India’s future."
    ],
    hi: [
      "राष्ट्रीय किसान मंच की स्थापना पूर्व प्रधानमंत्री श्री वी.पी. सिंह के विज़न और नेतृत्व में हुई थी — एक ऐसे नेता जिन्होंने सत्ता नहीं, बल्कि जनता का साथ चुना, विशेष रूप से गरीबों, पिछड़ों और भूले-बिसरे किसानों का। उस दौर में जब किसानों को राष्ट्रीय विमर्श से बाहर किया जा रहा था, उन्होंने एक ऐसे आंदोलन की नींव रखी जो किसानों की गरिमा, अधिकार और आय को फिर से स्थापित करे।",
      "उनके साथ खड़े थे शेखर दीक्षित — एक युवा कार्यकर्ता, जिन्होंने न केवल वी.पी. सिंह के आदर्शों को साझा किया, बल्कि हर कदम पर उनके साथ रहे — सुनते हुए, सीखते हुए, और उसी भावना से अपनी राह बनाते हुए। आज शेखर दीक्षित वी.पी. सिंह की विरासत को केवल स्मृति के रूप में नहीं, बल्कि एक मिशन के रूप में आगे बढ़ा रहे हैं — जिसमें किसान सार्वजनिक नीति के केंद्र में और संवैधानिक मूल्य राजनीति के मूल में हों।",
      "मंच कोई पार्टी नहीं है। यह लोगों का मंच है — संघर्ष में जड़ें, विश्वास पर निर्माण, और यह वादा कि भारत के भविष्य में कोई भी किसान अदृश्य नहीं रहेगा।"
    ]
  };

  const pulseData = [
    {
      titleTranslation: 'communityFirst',
      descTranslation: 'communityFirstDesc',
      title: 'Rashtriya Kisan Manch vs. Education Mafia: A Fight for Equal Access and Real Reform:',
      desc1: 'Rashtriya Kisan Manch has always stood for justice—not just for farmers, but for every citizen neglected by an unequal system. Today, one of the most dangerous and silent threats facing our youth is the commercialization of education, where profit has taken priority over learning, and opportunity is reserved only for those who can afford it.',
      desc2: 'Across the country, a powerful education mafia has captured schools, colleges, and even the coaching industry. They exploit students and parents by charging unaffordable fees, manipulating admissions, and prioritizing business over merit. In rural areas and small towns, government schools lie in disrepair while private schools flourish without regulation. The result? Bright children from poor families are pushed out of the system before they even get a chance.',
      desc3: 'Rashtriya Kisan Manch has taken a strong stand against this exploitation. We believe education is not a privilege—it is a right. The Manch is raising its voice to demand:',
      tagLine: 'Strict regulation of private institutions to prevent profiteering in the name of education.',
      list: [
        'Investment in government schools and colleges to ensure quality learning is available for all, not just the elite.',
        'Curbing the unregulated coaching industry, which has turned learning into a luxury product.',
        'Scholarships and financial support for students from farming and marginalized communities.',
        'Accountability and transparency in school operations, fee structures, and examination processes.'
      ],
      icon: 'User',
      footer1: 'The Manch is organizing public awareness drives, supporting aggrieved families, and pressuring state and central governments to act decisively. We are also working with educators, student groups, and legal experts to push for policy-level change that dismantles the education mafia’s grip on our future.',
      footer2: 'For Rashtriya Kisan Manch, this is not just a policy issue—it is a fight for India’s soul. Because when a child in a village dreams of becoming a doctor, teacher, or scientist, it should be the quality of their mind—not the weight of their wallet—that decides their future.',
    },
    {
      titleTranslation: 'sustainability',
      descTranslation: 'sustainabilityDesc',
      title: 'Life Over Bills - A Fight Against Health Mafia:',
      desc1: 'Healthcare is a right, not a luxury. Yet in today’s India, access to basic treatment, medicines, and hospitals has become a business of profit over people. Private hospitals charge lakhs for ordinary procedures, life-saving medicines are sold at ten times their cost, and rural health centers remain broken or ignored. At the heart of this crisis is an unchecked, corrupt system — the health mafia.',
      desc2: 'Rashtriya Kisan Manch has taken a strong stand against this silent exploitation. The Manch believes that no farmer, no poor family, and no child should suffer or die just because they can’t afford treatment. Whether it is the shortage of doctors in rural areas, the sale of fake medicines, or the manipulation of diagnostic reports, Rashtriya Kisan Manch is exposing this network and fighting for real, structural change.',
      desc3: '',
      tagLine: 'We are demanding:',
      icon: 'Sprout',
      list: [
        'Free and quality healthcare for all citizens, especially in rural and low-income areas.',
        'Strict regulation and audit of private hospitals and pharma companies to curb profiteering.',
        'Functioning government hospitals in every block, with trained staff and sufficient resources.',
        'Transparent pricing of medicines and surgeries, and an end to overbilling and unnecessary treatments.',
        'Accountability in public health funds, ensuring that taxpayer money goes to patient care, not middlemen.'
      ],
      footer1: 'Through protests, public hearings, fact-finding teams, and dialogues with policymakers, Rashtriya Kisan Manch is making sure that the voice of the suffering reaches Parliament, not just the press. We are also supporting families who are victims of medical negligence and overcharging by helping them seek justice.',
      footer2: 'This is not just a health issue—it is a human issue, and one that affects millions of farmers, workers, and poor families. Rashtriya Kisan Manch believes that until healthcare becomes equal, ethical, and accessible, true development will remain a lie. We are not asking for charity. We are demanding constitutional guarantees for health, as a matter of dignity and justice.',
    },
    {
      titleTranslation: 'socialJustice',
      descTranslation: 'socialJusticeDesc',
      title: 'Wages Over Worship: A Movement for Income, Not Division:',
      desc1: 'In today’s political climate, the real struggles of ordinary Indians—especially farmers, workers, and the rural poor—are often drowned in noise about religion, caste, and identity. Rashtriya Kisan Manch was founded to challenge this very distortion of democracy. Our core message is simple yet powerful: "Don’t fight over faith. Fight for your fair share."',
      desc2: 'While politicians debate temples and castes, India’s farmers are still waiting for minimum support prices, laborers are still earning daily wages that barely feed a family, and young people are migrating for jobs that may never come. This is not just neglect—it’s distraction by design.',
      desc3: 'Rashtriya Kisan Manch believes that the real politics of this country must be about income, dignity, and opportunity. We are working across states to:',
      tagLine: 'Educate citizens—especially rural youth—to ask the right questions: “Where are the jobs?” “Why are prices rising?” “Why is farming unviable?”',
      list: [
        'Mobilize farmers to demand constitutional guarantees for fair MSP, pension, and income security.',
        'Pressure governments to invest in education, healthcare, and employment, not only religious infrastructure.',
        'Expose the false promises of communal politics and shift focus back to the kitchen table, not the temple doorstep.'
      ],
      icon: 'Scale',
      footer1: 'Our campaigns focus on rebuilding political consciousness among farmers and workers—not with anger, but with awareness. We believe that every vote should be cast for policies that improve lives, not identities that divide them.',
      footer2: 'This is not anti-religion. This is pro-reality. India cannot rise while its farmers are in debt, its youth are unemployed, and its poorest are turned against each other. The true struggle is economic—and Rashtriya Kisan Manch is leading it.',
    },
    {
      titleTranslation: 'innovation',
      descTranslation: 'innovationDesc',
      title: 'Cost Without Care: Fight Against Misuse of Public Funds:',
      desc1: 'Across India, farmers are losing crops to floods and droughts, patients in rural areas wait hours for a doctor, and children are still learning in schools without chairs, toilets, or books. And yet, our elected leaders continue to spend public money on lavish bungalows, bulletproof cars, decorative events, and luxury foreign tours—all paid for by the very people they are ignoring.',
      desc2: 'Rashtriya Kisan Manch says: Enough is enough. This isn’t just about budgets—it’s about dignity and fairness. Why should a farmer who pays tax on every litre of diesel and every kilo of salt fund the luxuries of a politician who doesn’t even visit his village? Why should a labourer’s sweat pay for someone else’s security convoy?',
      desc3: 'Public money belongs to the public. It must be used to fix broken schools, to provide medicines in health centres, to ensure irrigation in dry fields—not to fund a VIP lifestyle. Rashtriya Kisan Manch is taking this fight to the ground. We are:',
      tagLine: 'Educating people to ask, "Where is my money going?"',
      list: [
        'Demanding transparency in how every rupee is spent by governments.',
        'Calling out leaders who use public funds for personal image-building while ignoring public pain.',
        'Pushing for policies that make education, health, and rural development the first priority in every budget.'
      ],
      icon: 'Lightbulb',
      footer1: 'This is not a protest against individuals—it’s a stand for the people.',
      footer2: 'Because the money that comes from a farmer’s field, a shopkeeper’s register, or a labourer’s day’s wage should return to them in the form of better roads, schools, hospitals, and a life of dignity. Rashtriya Kisan Manch believes politics must serve—not spend.',
    }
  ];


  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb customItems={[
          { label: getTranslation('home'), path: '/homepage', isActive: false },
          { label: getTranslation('about'), path: '/about-page', isActive: true }
        ]} />

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <Icon name="Info" size={32} color="white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            {getTranslation('aboutOurMovement')}
          </h1>
          <p className="text-lg text-text-secondary mx-auto">
            {getTranslation('aboutPageDesc')}
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="relative rounded-xl overflow-hidden mb-16 h-96">
          <Image
            src="https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Farmers in a field"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h2 className="text-3xl font-heading font-bold mb-2">{getTranslation('empoweringRuralIndia')}</h2>
              <p className="text-lg opacity-90">{getTranslation('grassrootsTransformation')}</p>
            </div>
          </div>
        </div>

        {/* Organizational Overview Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">{getTranslation('ourStory')}</h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                {ourStoryContent[language]?.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden h-48">
                  <Image
                    src={story3}
                    alt="Early days of the movement"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden h-48">
                  <Image
                    src={story2}
                    alt="Community meeting"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-full">
                <Image
                  src={story1}
                  alt="Farmer in the field"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}<section className="mb-20 bg-surface rounded-xl p-8 shadow-md">
          <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">{getTranslation('coreValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pulseData.map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-background rounded-lg hover:shadow-md transition-smooth cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={item.icon} size={32} color="white" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary mb-2">{getTranslation(item.titleTranslation)}</h3>
                <p className="text-text-secondary">
                  {getTranslation(item.descTranslation)}
                </p>
              </div>
            ))}
          </div>

          {/* Modal */}
          <Dialog open={!!selected} onClose={() => setSelected(null)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4 top-10">
              <Dialog.Panel className="max-w-3xl w-full bg-white rounded-xl p-6 overflow-y-auto max-h-[75vh] shadow-xl">
                {selected && (
                  <>
                    <Dialog.Title className="text-2xl font-bold text-primary mb-4">{selected.title}</Dialog.Title>
                    <p className="mb-3">{selected.desc1}</p>
                    <p className="mb-3">{selected.desc2}</p>
                    <p className="mb-3">{selected.desc3}</p>

                    <p className="font-semibold text-primary mb-2">{selected.tagLine}</p>

                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      {selected.list.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>

                    <p className="mb-3">{selected.footer1}</p>
                    <p className="mb-3">{selected.footer2}</p>

                    <div className="text-right">
                      <button
                        onClick={() => setSelected(null)}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </div>
          </Dialog>
        </section>
        {/* <section className="mb-20 bg-surface rounded-xl p-8 shadow-md">
          <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">{getTranslation('coreValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-background rounded-lg hover:shadow-md transition-smooth">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={32} color="white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">{getTranslation('communityFirst')}</h3>
              <p className="text-text-secondary">
                {getTranslation('communityFirstDesc')}
              </p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg hover:shadow-md transition-smooth">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Sprout" size={32} color="white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">{getTranslation('sustainability')}</h3>
              <p className="text-text-secondary">
                {getTranslation('sustainabilityDesc')}
              </p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg hover:shadow-md transition-smooth">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Scale" size={32} color="white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">{getTranslation('socialJustice')}</h3>
              <p className="text-text-secondary">
                {getTranslation('socialJusticeDesc')}
              </p>
            </div>

            <div className="text-center p-6 bg-background rounded-lg hover:shadow-md transition-smooth">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Lightbulb" size={32} color="white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">{getTranslation('innovation')}</h3>
              <p className="text-text-secondary">
                {getTranslation('innovationDesc')}
              </p>
            </div>
          </div>
        </section> */}

        {/* Impact Metrics Section */}
        <ImpactMetrics />

        {/* Organizational Structure */}
        {/* <TeamStructure /> */}

        {/* Milestones Timeline */}
        {/* <MilestoneTimeline /> */}

        {/* Testimonials Section */}
        <Testimonials />

        {/* Partnership Section */}
        <PartnershipSection showPartnershipModal={showPartnershipModal} setShowPartnershipModal={setShowPartnershipModal} />

        {/* Call to Action Section */}
        <section className="my-20 text-center">
          <div className="card bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl">
            <h3 className="text-2xl font-heading font-semibold mb-4">
              {getTranslation('joinOurMovement')}
            </h3>
            <p className="text-lg mb-6 opacity-90 max-w-3xl mx-auto">
              {getTranslation('joinMovementDesc')}
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
                {getTranslation('kisanLeadershipProgram')}
              </button>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-20 bg-surface rounded-xl p-8 shadow-md" id='contact'>
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <h3 className="text-2xl font-heading font-semibold text-primary mb-4">{getTranslation('contactUs')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Icon name="MapPin" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">{getTranslation('headquarters')}</p>
                    <p className="text-text-secondary">1, Paper Mill Colony, Valmiki Nagar, </p>
                    <p className="text-text-secondary">Lucknow, Uttar Pradesh, 226006</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="Mail" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:info@kisanandolan.org" className="text-primary hover:underline">info@kisanandolan.org</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="Phone" size={20} className="text-primary mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+911234567890" className="text-primary hover:underline">+917860411111</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <h3 className="text-2xl font-heading font-semibold text-primary mb-4">{getTranslation('regionalOffices')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium">{getTranslation('northIndia')}</p>
                  <p className="text-text-secondary">Lucknow, Uttar Pradesh</p>
                </div>

                <div>
                  <p className="font-medium">{getTranslation('southIndia')}</p>
                  <p className="text-text-secondary">Bangalore, Karnataka</p>
                </div>

                <div>
                  <p className="font-medium">{getTranslation('eastIndia')}</p>
                  <p className="text-text-secondary">Kolkata, West Bengal</p>
                </div>

                <div>
                  <p className="font-medium">{getTranslation('westIndia')}</p>
                  <p className="text-text-secondary">Ahmedabad, Gujarat</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-heading font-semibold text-primary mb-4">{getTranslation('connectWithUs')}</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/orgrkmkisan" className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors">
                  <Icon name="Facebook" size={20} color="white" />
                </a>
                <a href="https://x.com/rkmkisanmanch" className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors">
                  <Icon name="Twitter" size={20} color="white" />
                </a>
                <a href="https://www.instagram.com/rkmkisanmanch/" className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors">
                  <Icon name="Instagram" size={20} color="white" />
                </a>
                <a href="https://wa.me/+911234567890?text=Hello, I want to know more!" className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors">
                  <Icon name="PhoneOutgoing" size={20} color="white" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Member Registration Modal */}
      {showMemberRegistration && <MemberRegistrationModal onClose={() => setShowMemberRegistration(false)} />}

      {/* Youth Leadership Program Modal */}
      {showYouthProgram && <YouthLeadershipProgramModal onClose={() => setShowYouthProgram(false)} />}
    </div>
  );
};

export default AboutPage;
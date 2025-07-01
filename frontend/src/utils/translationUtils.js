// Translation utilities for static content

// Achievement translations for timeline entries
export const achievementTranslations = {
  // English to Hindi mapping
  "Debt Relief Assistance": "कर्ज राहत सहायता",
  "Organic Farming Training": "जैविक खेती प्रशिक्षण",
  "Access to Agricultural Equipment": "कृषि उपकरणों तक पहुंच",
  "Farmer Market Linkage Programs": "किसान बाजार संपर्क कार्यक्रम",
  "Crop Insurance Enrollment Drive": "फसल बीमा नामांकन अभियान",
  "Children's Education Support": "बच्चों की शिक्षा सहायता",
  "Water Conservation & Irrigation Projects": "जल संरक्षण और सिंचाई परियोजनाएँ",
  "Rural Health Camps & Mental Health Support": "ग्रामीण स्वास्थ्य शिविर और मानसिक स्वास्थ्य सहायता"
};

// Helper function to translate achievements based on language
export const translateAchievement = (achievement, language) => {
  if (!achievement) return "";
  
  if (language === 'hi') {
    return achievementTranslations[achievement] || achievement;
  }
  
  return achievement;
}; 
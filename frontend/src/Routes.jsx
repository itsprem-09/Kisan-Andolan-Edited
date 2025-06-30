import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import Footer from "pages/homepage/components/Footer";
import Homepage from "pages/homepage";
import OurVisionMissionPage from "pages/our-vision-mission-page";
import AndolanTimelinePage from "pages/andolan-timeline-page";
import TeamLeadershipPage from "pages/team-leadership-page";
import AdminDashboard from "pages/admin-dashboard";
import MemberRegistrationModal from "pages/member-registration-modal";
import InformationCenterPage from "pages/information-center-page";
import AboutPage from "pages/about-page";
import YouthLeadershipProgramModal from "pages/youth-leadership-program-modal";
import Login from "pages/login";
import NotFound from "pages/NotFound";
import PrivacyPolicy from "pages/PrivacyPolicy";
import TermsOfService from "pages/TermsOfService";
import CookiePolicy from "pages/CookiePolicy";
import DataProtectionPolicy from "pages/DataProtectionPolicy";
import Disclaimer from "pages/Disclaimer";
import CommunityGuidelines from "pages/CommunityGuidelines";
import FAQ from "pages/FAQ";
import PrivateRoute from "components/PrivateRoute";
import { AuthProvider } from "contexts/AuthContext";
import ExampleTranslatedPage from "pages/ExampleTranslatedPage";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/" element={<><Homepage /></>} />
            <Route path="/homepage" element={<><Header /><Homepage /></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/our-vision-mission-page" element={<><Header /><OurVisionMissionPage /><Footer /></>} />
            <Route path="/andolan-timeline-page" element={<><Header /><AndolanTimelinePage /><Footer /></>} />
            <Route path="/team-leadership-page" element={<><Header /><TeamLeadershipPage /><Footer /></>} />
            <Route path="/member-registration-modal" element={<><Header /><MemberRegistrationModal /><Footer /></>} />
            <Route path="/information-center-page" element={<><Header /><InformationCenterPage /><Footer /></>} />
            <Route path="/about-page" element={<><Header /><AboutPage /><Footer /></>} />
            <Route path="/youth-leadership-program-modal" element={<><Header /><YouthLeadershipProgramModal /><Footer /></>} />
            <Route path="/privacy" element={<><Header /><PrivacyPolicy /><Footer /></>} />
            <Route path="/terms" element={<><Header /><TermsOfService /><Footer /></>} />
            <Route path="/cookies" element={<><Header /><CookiePolicy /><Footer /></>} />
            <Route path="/data-protection" element={<><Header /><DataProtectionPolicy /><Footer /></>} />
            <Route path="/disclaimer" element={<><Header /><Disclaimer /><Footer /></>} />
            <Route path="/guidelines" element={<><Header /><CommunityGuidelines /><Footer /></>} />
            <Route path="/faqs" element={<><Header /><FAQ /><Footer /></>} />
            <Route path="/example-translation" element={<><Header /><ExampleTranslatedPage /><Footer /></>} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin-dashboard" element={<><Header /><AdminDashboard /></>} />
              <Route path="/admin-dashboard/*" element={<><Header /><AdminDashboard /></>} />
            </Route>
            
            <Route path="*" element={<><Header /><NotFound /></>} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
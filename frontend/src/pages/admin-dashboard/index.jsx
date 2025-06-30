import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Breadcrumb from 'components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import HeroBanner from './components/HeroBanner';
import ContentManagement from './components/ContentManagement';
import MemberApplications from './components/MemberApplications';
import TimelineManagement from './components/TimelineManagement';
import AboutPageManagement from './components/AboutPageManagement';
import PartnerInquiriesManagement from './components/PartnerInquiriesManagement';
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('content');
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

  // Check authentication when component mounts
  useEffect(() => {
    const verifyAuth = async () => {
      // Force a fresh auth check
      checkAuth();

      // Check localStorage directly as a safeguard
      try {
        const tokenData = localStorage.getItem('tokenData');
        const hasValidToken = tokenData && JSON.parse(tokenData).expiry > Date.now();

        console.log('Admin Dashboard auth check:', {
          isAuthenticated,
          hasValidToken
        });

        // If no valid token, redirect to login
        if (!isAuthenticated && !hasValidToken) {
          console.log('No valid authentication found, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking auth in admin dashboard:', error);
      }
    };

    verifyAuth();
  }, [isAuthenticated, checkAuth, navigate]);

  const metricsData = [
    {
      title: "Total Members",
      value: "2,847",
      change: "+12%",
      changeType: "increase",
      icon: "Users",
      description: "Active registered members"
    },
    {
      title: "Pending Applications",
      value: "156",
      change: "+8",
      changeType: "increase",
      icon: "Clock",
      description: "Awaiting verification"
    },
    {
      title: "Content Engagement",
      value: "89.2%",
      change: "+5.3%",
      changeType: "increase",
      icon: "TrendingUp",
      description: "Average engagement rate"
    },
    {
      title: "System Health",
      value: "99.8%",
      change: "0%",
      changeType: "neutral",
      icon: "Shield",
      description: "Uptime this month"
    }
  ];

  const quickActionsData = [
    {
      title: "Approve Applications",
      description: "Review and approve pending member applications",
      icon: "CheckCircle",
      count: 23,
      action: "approve-applications"
    },
    {
      title: "Publish Content",
      description: "Publish drafted articles and announcements",
      icon: "FileText",
      count: 5,
      action: "publish-content"
    },
    {
      title: "Manage Timeline",
      description: "Add or edit timeline entries and milestones",
      icon: "Clock",
      count: null,
      action: "manage-timeline"
    },
    {
      title: "Update About Page",
      description: "Edit content for the About page sections",
      icon: "Info",
      count: null,
      action: "manage-about"
    },
    {
      title: "Upload Media",
      description: "Add new images and videos to media library",
      icon: "Upload",
      count: null,
      action: "upload-media"
    },
    {
      title: "Send Notifications",
      description: "Send announcements to all members",
      icon: "Bell",
      count: null,
      action: "send-notifications"
    }
  ];

  const sectionTabs = [
    { id: 'home', label: 'Hero Banner', icon: 'ImageUp' },
    { id: 'content', label: 'Content Management', icon: 'FileText' },
    { id: 'members', label: 'Member Applications', icon: 'Users' },
    { id: 'timeline', label: 'Timeline Management', icon: 'Clock' },
    { id: 'about', label: 'About Page', icon: 'Info' },
    { id: 'partner-inquiries', label: 'Partnership Inquiries', icon: 'Handshake' }
  ];

  const handleQuickAction = (action) => {
    console.log(`Quick action triggered: ${action}`);

    // Set the active section based on the action
    switch (action) {
      case 'approve-applications':
        setActiveSection('members');
        break;
      case 'publish-content':
        setActiveSection('content');
        break;
      case 'manage-timeline':
        setActiveSection('timeline');
        break;
      case 'manage-about':
        setActiveSection('about');
        break;
      case 'upload-media':
        // Handle media upload
        break;
      case 'send-notifications':
        // Handle notifications
        break;
      default:
        break;
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HeroBanner />
      case 'content':
        return <ContentManagement />;
      case 'members':
        return <MemberApplications />;
      case 'timeline':
        return <TimelineManagement />;
      case 'about':
        return <AboutPageManagement />;
      case 'partner-inquiries':
        return <PartnerInquiriesManagement />;
      default:
        return (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {metricsData.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))}
            </div>

            {/* Quick Actions and Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <QuickActions
                  actions={quickActionsData}
                  onActionClick={handleQuickAction}
                />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container-custom py-8">
        <Breadcrumb />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                Admin Dashboard
              </h1>
              <p className="text-text-secondary font-body">
                Manage your agricultural community platform
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>

              <button className="btn-primary flex items-center space-x-2">
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {sectionTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-smooth ${activeSection === tab.id
                      ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Active Section Content */}
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;
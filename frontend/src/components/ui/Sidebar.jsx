import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const adminNavigationItems = [
    { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' },
    { label: 'Member Management', path: '/admin-dashboard/members', icon: 'Users' },
    { label: 'Content Management', path: '/admin-dashboard/content', icon: 'FileText' },
    { label: 'Program Management', path: '/admin-dashboard/programs', icon: 'Calendar' },
    { label: 'Analytics', path: '/admin-dashboard/analytics', icon: 'BarChart3' },
    { label: 'Settings', path: '/admin-dashboard/settings', icon: 'Settings' },
  ];

  const quickActions = [
    { label: 'Add Member', icon: 'UserPlus', action: 'add-member' },
    { label: 'Create Event', icon: 'Plus', action: 'create-event' },
    { label: 'Send Notice', icon: 'Bell', action: 'send-notice' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-surface border-r border-border z-80 transition-layout ${
      isCollapsed ? 'w-16' : 'w-64'
    } lg:translate-x-0 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={16} color="white" />
              </div>
              <div>
                <h2 className="text-sm font-heading font-semibold text-primary">
                  Admin Panel
                </h2>
                <p className="text-xs text-text-secondary font-caption">
                  Management Hub
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-background transition-smooth touch-target"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        <div className="space-y-1">
          {!isCollapsed && (
            <h3 className="text-xs font-caption font-medium text-text-secondary uppercase tracking-wider mb-3">
              Navigation
            </h3>
          )}
          
          {adminNavigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link flex items-center space-x-3 px-3 py-2 rounded-md transition-smooth touch-target group ${
                isActivePath(item.path) 
                  ? 'nav-link-active bg-background border-l-4 border-primary' :'hover:bg-background'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon 
                name={item.icon} 
                size={18} 
                className={isActivePath(item.path) ? 'text-primary' : 'text-text-secondary group-hover:text-primary'} 
              />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-border">
          {!isCollapsed && (
            <h3 className="text-xs font-caption font-medium text-text-secondary uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
          )}
          
          <div className="space-y-1">
            {quickActions.map((action) => (
              <button
                key={action.action}
                onClick={() => handleQuickAction(action.action)}
                className="w-full nav-link flex items-center space-x-3 px-3 py-2 rounded-md transition-smooth hover:bg-background touch-target group"
                title={isCollapsed ? action.label : ''}
              >
                <Icon 
                  name={action.icon} 
                  size={18} 
                  className="text-text-secondary group-hover:text-primary" 
                />
                {!isCollapsed && (
                  <span className="font-medium text-left">{action.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="pt-6 border-t border-border">
          <div className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-background transition-smooth cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="#4a7c59" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {currentUser?.email || 'admin@agricommunity.org'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full nav-link flex items-center space-x-3 px-3 py-2 rounded-md transition-smooth hover:bg-error hover:text-white touch-target group"
            title={isCollapsed ? 'Logout' : ''}
          >
            <Icon 
              name="LogOut" 
              size={18} 
              className="text-text-secondary group-hover:text-white" 
            />
            {!isCollapsed && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  const pathMap = {
    '/homepage': 'Home',
    '/our-vision-mission-page': 'Our Vision & Mission',
    '/andolan-timeline-page': 'Andolan Timeline',
    '/team-leadership-page': 'Team & Leadership',
    '/admin-dashboard': 'Admin Dashboard',
    '/admin-dashboard/members': 'Member Management',
    '/admin-dashboard/content': 'Content Management',
    '/admin-dashboard/programs': 'Program Management',
    '/admin-dashboard/analytics': 'Analytics',
    '/admin-dashboard/settings': 'Settings',
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      path: '/homepage',
      isActive: false
    });

    // Build path progressively
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      if (pathMap[currentPath]) {
        breadcrumbs.push({
          label: pathMap[currentPath],
          path: currentPath,
          isActive: isLast
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/homepage' || location.pathname === '/') {
    return null;
  }

  return (
    <nav 
      className="flex items-center space-x-2 text-sm font-caption mb-6"
      aria-label="Breadcrumb navigation"
    >
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              className="text-text-secondary" 
              aria-hidden="true"
            />
          )}
          
          {crumb.isActive ? (
            <span 
              className="text-primary font-medium"
              aria-current="page"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-text-secondary hover:text-primary transition-smooth"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import logo from '/assets/images/logo.webp';
import LanguageToggle from 'components/LanguageToggle';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTranslation } = useLanguage();

  const navigationItems = [
    { label: getTranslation('home'), path: '/homepage', icon: 'Home' },
    { label: getTranslation('about'), path: '/about-page', icon: 'Users' },
    { label: getTranslation('visionMission'), path: '/our-vision-mission-page', icon: 'Target' },
    { label: getTranslation('informationCenter'), path: '/information-center-page', icon: 'Book' },
    { label: getTranslation('timeline'), path: '/andolan-timeline-page', icon: 'Clock' },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMemberRegistration = () => {
    navigate('/member-registration-modal');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-100 shadow-sm py-2">
      <div className="container-custom mx-auto px-2">
        <div className="flex items-center h-20 w-full">

          {/* Logo */}
          <Link
            to="/homepage"
            className="flex-shrink-0 p-2 mr-4 border-none focus:outline-none"
            onClick={closeMobileMenu}
          >
            <img
              src={logo}
              alt="logo"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-center min-w-0 overflow-hidden">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-1 px-2 py-1.5 text-sm rounded-md transition-smooth touch-target whitespace-nowrap ${isActivePath(item.path) ? 'nav-link-active bg-background' : 'hover:bg-background'
                    }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* CTA + Language Button */}
          <div className="hidden lg:flex items-center gap-4 pl-4 flex-shrink-0">
            <button
              onClick={handleMemberRegistration}
              className="btn-primary text-xs px-4 py-3 rounded-md touch-target whitespace-nowrap"
            >
              {getTranslation('becomeMember')}
            </button>
            <LanguageToggle />
            {location.pathname === "/admin-dashboard" && <button onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("tokenData");
              navigate('/')
            }}>Logout</button>}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md hover:bg-background transition-smooth touch-target ml-auto focus:outline-none"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-surface border-t border-border z-90 animate-fade-in">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`nav-link flex items-center space-x-3 px-4 py-3 rounded-md transition-smooth touch-target ${isActivePath(item.path) ? 'nav-link-active bg-background' : 'hover:bg-background'
                  }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            <div className="pt-4 border-t border-border mt-4 space-y-2">
              <button
                onClick={() => {
                  handleMemberRegistration();
                  closeMobileMenu();
                }}
                className="w-full btn-primary text-left px-4 py-3 touch-target"
              >
                {getTranslation('becomeMember')}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
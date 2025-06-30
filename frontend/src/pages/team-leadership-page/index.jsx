import React, { useState, useEffect } from 'react';
import Breadcrumb from 'components/ui/Breadcrumb';
import { useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import axios from 'axios';
import api from 'services/api';

import TeamMemberCard from './components/TeamMemberCard';
import TeamMemberModal from './components/TeamMemberModal';

const TeamLeadershipPage = () => {
  const location = useLocation();
  const loactionSelectedMember = location.state?.selectedMember;
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/team');
        setTeamMembers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);

  useEffect(() => {
  if (loactionSelectedMember) {
    setSelectedMember(loactionSelectedMember); 
  }
}, [loactionSelectedMember]);


  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.description && member.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <div className="container-custom py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
              Team & Leadership
            </h1>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto font-body">
              Meet the dedicated leaders and team members who are driving the Rashtriya Kishan Manch forward, 
              working tirelessly to empower farmers and transform agricultural communities across India.
            </p>
          </div>

          {/* Search Filter */}
          <div className="mb-12">
            <div className="bg-surface rounded-lg shadow-base border border-border p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <label htmlFor="search" className="form-label">
                    Search Team Members
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="Search" size={18} className="text-text-secondary" />
                    </div>
                    <input
                      id="search"
                      type="text"
                      placeholder="Search by name, role, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Clear Search */}
                {searchTerm && (
                  <div className="flex items-end">
                    <button
                      onClick={() => setSearchTerm('')}
                      className="btn-outline flex items-center space-x-2 h-12"
                    >
                      <Icon name="X" size={16} />
                      <span>Clear</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-text-secondary">
                  {searchTerm ? (
                    <>
                      Showing filtered results for "<strong>{searchTerm}</strong>"
                    </>
                  ) : (
                    'Showing all team members'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-4">
                Our Team
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto font-body">
                Our diverse team brings together expertise from various fields to create comprehensive 
                solutions for the agricultural community.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 border-4 border-t-primary border-primary/30 rounded-full animate-spin"></div>
                <p className="mt-4 text-text-secondary">Loading team members...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Icon name="AlertTriangle" size={48} className="text-red-500 mx-auto mb-4" />
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary mt-4"
                >
                  Try Again
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No team members found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMembers.map((member) => (
                  <TeamMemberCard
                    key={member._id}
                    member={member}
                    onClick={handleMemberClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TeamLeadershipPage;
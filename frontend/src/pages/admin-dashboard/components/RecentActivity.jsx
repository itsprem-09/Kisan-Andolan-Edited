import React from 'react';
import Icon from 'components/AppIcon';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "member_registration",
      user: "Rajesh Kumar",
      action: "submitted membership application",
      timestamp: new Date(Date.now() - 300000),
      icon: "UserPlus",
      iconColor: "#22c55e"
    },
    {
      id: 2,
      type: "content_update",
      user: "Admin",
      action: "updated Vision & Mission content",
      timestamp: new Date(Date.now() - 900000),
      icon: "FileText",
      iconColor: "#3b82f6"
    },
    {
      id: 3,
      type: "media_upload",
      user: "Content Manager",
      action: "uploaded 5 new images to gallery",
      timestamp: new Date(Date.now() - 1800000),
      icon: "Image",
      iconColor: "#8b5cf6"
    },
    {
      id: 4,
      type: "application_approved",
      user: "Admin",
      action: "approved 12 membership applications",
      timestamp: new Date(Date.now() - 3600000),
      icon: "CheckCircle",
      iconColor: "#22c55e"
    },
    {
      id: 5,
      type: "timeline_update",
      user: "Admin",
      action: "added new milestone to Andolan timeline",
      timestamp: new Date(Date.now() - 7200000),
      icon: "Clock",
      iconColor: "#f59e0b"
    },
    {
      id: 6,
      type: "notification_sent",
      user: "Admin",
      action: "sent announcement to all members",
      timestamp: new Date(Date.now() - 10800000),
      icon: "Bell",
      iconColor: "#ef4444"
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Recent Activity
        </h2>
        <button className="text-primary hover:text-secondary transition-smooth text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background transition-smooth">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${activity.iconColor}20` }}
            >
              <Icon 
                name={activity.icon} 
                size={16} 
                color={activity.iconColor} 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    <span className="text-text-secondary">{activity.action}</span>
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
                
                <button className="opacity-0 group-hover:opacity-100 transition-smooth">
                  <Icon name="MoreHorizontal" size={16} className="text-text-secondary" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full btn-outline text-sm py-2">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
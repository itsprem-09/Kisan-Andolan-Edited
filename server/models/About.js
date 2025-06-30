const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
  {
    // Impact Metrics
    impactMetrics: {
      farmers: {
        type: Number,
        default: 100000,
      },
      villages: {
        type: Number,
        default: 1250,
      },
      programs: {
        type: Number,
        default: 45,
      },
      states: {
        type: Number,
        default: 18,
      },
    },
    
    // Sustainable Growth boxes and other info boxes
    infoBoxes: [
      {
        title: {
          type: String,
          required: true,
        },
        hindi_title: {
          type: String,
          default: '',
        },
        description: {
          type: String,
          required: true,
        },
        hindi_description: {
          type: String,
          default: '',
        },
        icon: {
          type: String,
          default: 'TrendingUp',
        },
      },
    ],
    
    // Community Voices - Testimonials
    testimonials: [
      {
        quote: {
          type: String,
          required: true,
        },
        hindi_quote: {
          type: String,
          default: '',
        },
        author: {
          type: String,
          required: true,
        },
        hindi_author: {
          type: String,
          default: '',
        },
        role: {
          type: String,
          required: true,
        },
        hindi_role: {
          type: String,
          default: '',
        },
        image: {
          type: String,
          default: '',
        },
        impact: {
          type: String,
          required: true,
        },
        hindi_impact: {
          type: String,
          default: '',
        },
      },
    ],
    
    // Community Voice stats tabs
    communityStats: {
      successStories: {
        type: Number,
        default: 850,
      },
      satisfactionRate: {
        type: Number,
        default: 92,
      },
      incomeIncrease: {
        type: Number,
        default: 45,
      },
    },
    
    // Partners
    partnerCategories: [
      {
        category: {
          type: String,
          required: true,
        },
        hindi_category: {
          type: String,
          default: '',
        },
        partners: [{
          type: String,
          required: true,
        }],
        icon: {
          type: String,
          default: 'Building',
        },
      },
    ],
    
    // Partnership approach content
    partnershipApproach: {
      title: {
        type: String,
        default: 'Our Partnership Approach',
      },
      description: {
        type: String,
        default: 'We believe in collaborative solutions that leverage the strengths of diverse organizations to create sustainable impact for farming communities.',
      },
      values: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          icon: {
            type: String,
            default: 'Target',
          },
        },
      ],
    },
    
    // Last updated timestamp
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model('About', AboutSchema);

module.exports = About; 
import {
  Zap,
  Eye,
  MousePointerClick,
  MessageCircle,
  Heart,
  Share2,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";

// --- Mock Data Source ---

// --- DEBUG CONFIGURATION ---
// Toggle this value to simulate different states in the Analytics Dashboard.
// Options:
// - 'default': Full Data
// - 'empty': Global Zero State
// - 'no_email': Email section empty
// - 'no_social': Social section empty
export const ACTIVE_DEBUG_SCENARIO = "default";

export const analyticsData = {
  // Global Filter Options
  dateRanges: [
    { label: "Last 30 Days", value: "30d" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Last 90 Days", value: "90d" },
  ],

  // 1. North Star Metrics (Aggregated)
  northStar: {
    reach: {
      value: 12500,
      trend: 12, // percentage increase
      trendDirection: "up",
      label: "Total Reach",
      desc: "Unique eyes on your content across all channels.",
      chartData: [45, 52, 49, 62, 68, 74, 85, 90, 88, 95, 110, 125], // simplified trend line
    },
    engagement: {
      value: 850,
      trend: 5,
      trendDirection: "up",
      label: "Customer Engagement",
      desc: "Clicks, likes, comments, and shares.",
      chartData: [20, 22, 25, 24, 30, 35, 32, 40, 45, 42, 48, 50],
    },
    activities: {
      value: 12,
      trend: 0,
      label: "Activities Published",
      desc: "Total campaigns and posts launched.",
      chartData: [1, 2, 1, 3, 2, 4, 3, 2, 5, 4, 6, 12],
    },
  },

  // 2. Channel Performance
  channelPerformance: {
    email: {
      openRate: 25, // Percentage
      ctr: 3.2, // Percentage
      industryBenchmarks: {
        // Constants
        openRate: 20,
        ctr: 2.5,
      },
      insight: "Higher", // Pre-calculated logic for MVP
    },
    social: {
      totalInteractions: 850,
      platforms: [
        {
          name: "Instagram",
          engagementCount: 650, // High for "3x" logic
          icon: "Instagram",
        },
        {
          name: "Facebook",
          engagementCount: 200, // Low
          icon: "Facebook",
        },
      ],
      insight: {
        winner: "Instagram",
        loser: "Facebook",
        multiplier: 3, // 600 / 200 = 3x (approx)
      },
    },
  },

  // 3. Campaign Effectiveness (Attribution)
  campaignAttribution: [
    {
      id: "c1",
      name: "Summer Sale 2025: Exclusive Diamond & Timepiece Collection Launch Event",
      brand: "Rolex",
      logo: null,
      channels: ["email", "instagram", "facebook"],
      reach: 5200,
      socialEngagement: 120,
      traffic: 45,
      status: "active",
    },
    {
      id: "c2",
      name: "Holiday Gift Guide",
      brand: "Verragio",
      logo: null,
      channels: ["email"],
      reach: 2100,
      socialEngagement: null,
      traffic: 85,
      status: "expired",
    },
    {
      id: "c3",
      name: "Visual Moodboard",
      brand: "Verragio",
      logo: null,
      channels: ["instagram"],
      reach: 800,
      socialEngagement: 56,
      traffic: null,
      status: "active",
    },
    {
      id: "c4",
      name: "Diver's Watch Launch",
      brand: "Omega",
      logo: null,
      channels: ["email", "facebook"],
      reach: 3400,
      socialEngagement: 45,
      traffic: 28,
      status: "active",
    },
    {
      id: "c5",
      name: "Bridal Collection Preview",
      brand: "Tacori",
      logo: null,
      channels: ["instagram", "facebook"],
      reach: 1200,
      socialEngagement: 88,
      traffic: 12,
      status: "expired",
    },
    {
      id: "c6",
      name: "Exclusive VIP Event",
      brand: "Patek Philippe",
      logo: null,
      channels: ["email"],
      reach: 150,
      socialEngagement: null,
      traffic: 42,
      status: "expired",
    },
    {
      id: "c7",
      name: "Diamond Care Guide",
      brand: "Hearts On Fire",
      logo: null,
      channels: ["email", "instagram"],
      reach: 1800,
      socialEngagement: 34,
      traffic: 15,
      status: "active",
    },
    {
      id: "c8",
      name: "Limited Edition Drop",
      brand: "Breitling",
      logo: null,
      channels: ["instagram"],
      reach: 4500,
      socialEngagement: 210,
      traffic: null,
      status: "active",
    },
    {
      id: "c9",
      name: "Spring Trunk Show",
      brand: "Mikimoto",
      logo: null,
      channels: ["email", "facebook", "instagram"],
      reach: 2800,
      socialEngagement: 95,
      traffic: 38,
      status: "expired",
    },
    {
      id: "c10",
      name: "Chronograph Spotlight",
      brand: "Tag Heuer",
      logo: null,
      channels: ["email", "facebook"],
      reach: 1950,
      socialEngagement: 25,
      traffic: 22,
      status: "active",
    },
  ],

  // 5. Performance Trends (Chart Data)
  performanceTrends: [
    {
      date: "Nov 1",
      emailReach: 850,
      emailEngagement: 42,
      socialReach: 320,
      socialEngagement: 15,
    },
    {
      date: "Nov 2",
      emailReach: 920,
      emailEngagement: 48,
      socialReach: 350,
      socialEngagement: 18,
    },
    {
      date: "Nov 3",
      emailReach: 450,
      emailEngagement: 22,
      socialReach: 380,
      socialEngagement: 20,
    },
    {
      date: "Nov 4",
      emailReach: 0,
      emailEngagement: 5,
      socialReach: 400,
      socialEngagement: 25,
    }, // No email sent
    {
      date: "Nov 5",
      emailReach: 1200,
      emailEngagement: 65,
      socialReach: 420,
      socialEngagement: 28,
    }, // Big campaign
    {
      date: "Nov 6",
      emailReach: 600,
      emailEngagement: 30,
      socialReach: 450,
      socialEngagement: 35,
    },
    {
      date: "Nov 7",
      emailReach: 300,
      emailEngagement: 15,
      socialReach: 480,
      socialEngagement: 42,
    },
    {
      date: "Nov 8",
      emailReach: 1500,
      emailEngagement: 85,
      socialReach: 500,
      socialEngagement: 45,
    },
    {
      date: "Nov 9",
      emailReach: 800,
      emailEngagement: 40,
      socialReach: 520,
      socialEngagement: 50,
    },
    {
      date: "Nov 10",
      emailReach: 200,
      emailEngagement: 10,
      socialReach: 350,
      socialEngagement: 25,
    },
    {
      date: "Nov 11",
      emailReach: 1100,
      emailEngagement: 55,
      socialReach: 400,
      socialEngagement: 30,
    },
    {
      date: "Nov 12",
      emailReach: 750,
      emailEngagement: 38,
      socialReach: 600,
      socialEngagement: 55,
    },
    {
      date: "Nov 13",
      emailReach: 400,
      emailEngagement: 20,
      socialReach: 650,
      socialEngagement: 60,
    },
    {
      date: "Nov 14",
      emailReach: 1300,
      emailEngagement: 70,
      socialReach: 700,
      socialEngagement: 65,
    },
  ],
};

// Helper for Empty State simulation
export const getAnalyticsData = (scenario = ACTIVE_DEBUG_SCENARIO) => {
  // Base Data Clone
  const data = JSON.parse(JSON.stringify(analyticsData));

  // Scenario Logic
  if (scenario === "empty") {
    // Zero out everything
    Object.keys(data.northStar).forEach((k) => {
      data.northStar[k].value = 0;
      data.northStar[k].trend = 0;
      data.northStar[k].chartData = [];
    });
    data.channelPerformance.email.openRate = 0;
    data.channelPerformance.email.ctr = 0;
    data.channelPerformance.social.totalInteractions = 0;
    data.channelPerformance.social.platforms = [];
    data.campaignAttribution = [];
    data.performanceTrends = [];
    return data;
  }

  if (scenario === "no_email") {
    // Keep Social, Kill Email
    data.channelPerformance.email.openRate = 0;
    data.channelPerformance.email.ctr = 0;
    data.channelPerformance.email.insight = "No Data";
    // Filter out email campaigns if necessary, for now mock simply
  }

  if (scenario === "no_social") {
    // Keep Email, Kill Social
    data.channelPerformance.social.totalInteractions = 0;
    data.channelPerformance.social.platforms = [];
    data.channelPerformance.social.insight = {
      winner: "-",
      loser: "-",
      multiplier: 0,
    };
  }

  return data;
};

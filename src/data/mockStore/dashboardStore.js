import { memberStore } from "./memberStore";
const users = memberStore.members;
import { campaignData } from "./campaignStore";
const { campaigns } = campaignData;

// --- Dashboard Setup ---

export const retailerStatus = {
  isOnboarding: false, // Toggle this to test Onboarding vs Mature view
  onboardingProgress: 2, // Steps completed out of 5
};

export const onboardingTasks = [
  {
    id: "t-profile",
    title: "Store Profile",
    desc: "Logo & Timezone.",
    action: "Edit",
    link: "/settings",
    status: "completed",
    priority: "P0",
  },
  {
    id: "t-crm",
    title: "Import CRM",
    desc: "Add customers to enable Email Marketing.",
    action: "Upload",
    link: "/crm",
    status: "pending",
    priority: "P0",
    isCritical: true,
  },
  {
    id: "t-social",
    title: "Connect Social",
    desc: "Link FB/IG for publishing.",
    action: "Connect",
    link: "/settings",
    status: "completed",
    priority: "P1",
  },
  {
    id: "t-domain",
    title: "Verify Domain",
    desc: "Setup email sender.",
    action: "Setup",
    link: "/settings",
    status: "pending",
    priority: "P1",
  },
  {
    id: "t-team",
    title: "Invite Team",
    desc: "Add staff to help you.",
    action: "Invite",
    link: "/settings",
    status: "pending",
    priority: "P2",
  },
];

// Toggle this to test Empty State in Dashboard
export const showEmptyState = false;

export const kpiStats = {
  activities: {
    value: 12,
    brands: 8,
    channels: { email: 4, social: 8 },
  },
  reach: {
    value: 5200,
    trend: 15,
  },
  inbox: {
    value: 3,
    channels: { email: 1, chat: 2 },
  },
};

export const dashboardStats = { ...kpiStats }; // Backward compat if needed, but we will update Dashboard.jsx

export const actionQueue = [
  {
    id: "aq-1",
    type: "draft",
    title: "Summer Sale",
    desc: "You have an unsent email draft.",
    action: "Resume",
    status: "warning",
  },
  {
    id: "aq-2",
    type: "inbox",
    title: "Mike Ross",
    desc: "Waiting for reply > 2 hours.",
    action: "Reply",
    status: "urgent",
  },
  {
    id: "aq-3",
    type: "system",
    title: "Instagram Token",
    desc: "Token expired. Reconnect now.",
    action: "Fix",
    status: "critical",
  },
];

export const inboxSnapshot = [
  {
    id: "msg-1",
    user: users[0],
    message: "Is this watch available in store?",
    time: "10m ago",
    type: "social",
  },
  {
    id: "msg-2",
    user: users[1],
    message: "I need to reschedule my appointment.",
    time: "1h ago",
    type: "email",
  },
  {
    id: "msg-3",
    user: users[2],
    message: "Thanks for the catalog!",
    time: "3h ago",
    type: "sms",
  },
];

export const recentActivity = [
  {
    id: "act-1",
    title: "Summer Sale Email",
    metric: "25% Open Rate",
    type: "email",
    platform: "email",
    date: "2h ago",
  },
  {
    id: "act-2",
    title: "Verragio Post",
    metric: "120 Likes",
    type: "social",
    platform: "instagram",
    date: "5h ago",
  },
  {
    id: "act-3",
    title: "Holiday Collection",
    metric: "8 Shares",
    type: "social",
    platform: "facebook",
    date: "1d ago",
  },
  {
    id: "act-4",
    title: "Store Hours Update",
    metric: "450 Views",
    type: "social",
    platform: "gbp", // Google Business Profile
    date: "2d ago",
  },
];

// Helper to get Fresh Drops (using existing campaigns)
export const getFreshDrops = () => {
  // Return top 5 campaigns
  // Mocking 'isNew' status based on index for demo purposes
  const fresh = campaigns.slice(0, 5).map((c, i) => ({
    ...c,
    brandName: "Verragio",
    isNew: i === 0 || i === 1, // First 2 are new
  }));
  return fresh;
};

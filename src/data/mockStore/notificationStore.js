// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Timestamps
const NOW = new Date();

// We can stick to simple arithmetic if date-fns isn't available,
// but assuming standard environment. If not, I'll use vanilla JS in the logic below.
const getTimeAgo = (minutes) =>
  new Date(NOW.getTime() - minutes * 60000).toISOString();
const getDaysAgo = (days) =>
  new Date(NOW.getTime() - days * 86400000).toISOString();

/**
 * NOTIFICATION TYPES & TEMPLATES
 * Based on PRD "Trigger Logic"
 */

export const NOTIFICATION_TYPES = {
  SYSTEM_ALERT: "SYSTEM_ALERT", // P0
  QUOTA_REQUEST: "QUOTA_REQUEST", // P1
  NETWORK_GROWTH: "NETWORK_GROWTH", // P2
  PERFORMANCE: "PERFORMANCE", // P2
  ANNOUNCEMENT: "ANNOUNCEMENT", // P2
  CAMPAIGN_STATUS: "CAMPAIGN_STATUS", // P3
  SYSTEM_INFO: "SYSTEM_INFO", // P3
  NEW_OPPORTUNITY: "NEW_OPPORTUNITY", // P1 (Retailer)
  EXPIRATION: "EXPIRATION", // P2 (Retailer)
};

/**
 *  MOCK DATA GENERATOR
 *  Generates a list of notifications mixed for different roles
 */
export const getInitialNotifications = () => [
  // --- BRAND ADMIN ONLY (P0, P1) ---
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.SYSTEM_ALERT,
    priority: "P0",
    targetRoles: ["brand_admin"],
    title: "Action Required: Facebook Disconnected",
    message:
      "Your official account token has expired. Campaign posts will fail.",
    timestamp: getTimeAgo(15), // 15 mins ago
    isRead: false,
    actionLink: "settings-integrations", // mapped in UI
    metadata: { platform: "Facebook" },
  },
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.QUOTA_REQUEST,
    priority: "P1",
    targetRoles: ["brand_admin"],
    title: "Top-up Requested: Henne Jewelers",
    message:
      'Requested 5,000 email credits. Reason: "Holiday push needs more volume."',
    timestamp: getTimeAgo(45),
    isRead: false,
    actionLink: "retailer-detail",
    metadata: { retailerId: "r-12", amount: 5000 },
  },

  // --- BRAND ALL ROLES (P2) ---
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.NETWORK_GROWTH,
    priority: "P2",
    targetRoles: ["brand_admin", "brand_member"],
    title: "New Partner Joined",
    message: "London Jewelers (North East) has activated their account.",
    timestamp: getDaysAgo(1),
    isRead: true,
    actionLink: "retailer-profile",
    metadata: { retailerId: "r-21" },
  },
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.PERFORMANCE,
    priority: "P2",
    targetRoles: ["brand_admin", "brand_member"],
    title: "Trending: 2024 Bridal Collection",
    message:
      "High adoption! 82% of your retailers have participated in this campaign.",
    timestamp: getTimeAgo(120), // 2 hours ago
    isRead: false,
    actionLink: "campaign-analytics",
    metadata: { campaignId: "c-01", metric: "adoption", value: "82%" },
  },

  // --- RETAILER ADMIN ONLY (P0) ---
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.SYSTEM_ALERT,
    priority: "P0",
    targetRoles: ["retailer_admin"],
    title: "Connection Error",
    message: "Your Instagram token expired. Please reconnect to publish posts.",
    timestamp: getTimeAgo(30),
    isRead: false,
    actionLink: "settings-social",
    metadata: { platform: "Instagram" },
  },
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.SYSTEM_ALERT,
    priority: "P0",
    targetRoles: ["retailer_admin"],
    title: "Low Email Credits",
    message: "You have used 90% of your allowance. Request a top-up soon.",
    timestamp: getDaysAgo(2),
    isRead: true, // Old alert
    actionLink: "credit-wallet",
    metadata: { remaining: 100 },
  },

  // --- RETAILER ALL ROLES (P1, P2) ---
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.NEW_OPPORTUNITY,
    priority: "P1",
    targetRoles: ["retailer_admin", "retailer_member"],
    title: "New Campaign: Holiday Gift Guide",
    message: "Verragio released a new collection. Download assets now.",
    timestamp: getTimeAgo(10), // Just now
    isRead: false,
    actionLink: "brand-campaign-detail",
    metadata: { campaignId: "c-05", brand: "Verragio" },
  },
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.EXPIRATION,
    priority: "P2",
    targetRoles: ["retailer_admin", "retailer_member"],
    title: "Expiring Soon: Fall Essentials",
    message: "This campaign ends in 3 days. Use assets before they are gone.",
    timestamp: getTimeAgo(8),
    isRead: false,
    actionLink: "brand-campaign-detail",
    metadata: { campaignId: "c-03", daysLeft: 3, brand: "Rolex" },
  },

  // --- BRAND ADDITIONAL EXAMPLES ---
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.NETWORK_GROWTH,
    priority: "P2",
    targetRoles: ["brand_admin", "brand_member"],
    title: "New Partner Joined",
    message: "TIVOL (Midwest) has accepted your invitation.",
    timestamp: getDaysAgo(2),
    isRead: true,
    actionLink: "retailer-profile",
    metadata: { retailerId: "r-22" },
  },
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.PERFORMANCE,
    priority: "P2",
    targetRoles: ["brand_admin", "brand_member"],
    title: "Trending: Holiday Gift Guide",
    message:
      "Total Downloads > 200. This is your top performing asset this week!",
    timestamp: getDaysAgo(4),
    isRead: true,
    actionLink: "campaign-analytics",
    metadata: { campaignId: "c-05", metric: "downloads", value: "205" },
  },

  // --- RETAILER ADDITIONAL EXAMPLES ---
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.NEW_OPPORTUNITY,
    priority: "P1",
    targetRoles: ["retailer_admin", "retailer_member"],
    title: "New Campaign: Verragio Parisian",
    message: "Verragio released a new collection. Download assets now.",
    timestamp: getTimeAgo(5), // Just now
    isRead: false,
    actionLink: "brand-campaign-detail",
    metadata: { campaignId: "c-08", brand: "Verragio" },
  },
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.NEW_OPPORTUNITY,
    priority: "P1",
    targetRoles: ["retailer_admin", "retailer_member"],
    title: "New Campaign: Spring Forwards",
    message: "Hearts On Fire released a new collection. Be first to market.",
    timestamp: getTimeAgo(120), // 2 hours
    isRead: false,
    actionLink: "brand-campaign-detail",
  },
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.SYSTEM_INFO,
    priority: "P3",
    targetRoles: ["retailer_admin"],
    title: "Setup Reminder",
    message: "Import your customers to unlock email marketing features.",
    timestamp: getDaysAgo(6),
    isRead: false,
    actionLink: "settings-crm",
  },

  // --- GLOBAL SYSTEM ANNOUNCEMENT (All) ---
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.ANNOUNCEMENT,
    priority: "P2",
    targetRoles: [
      "brand_admin",
      "brand_member",
      "retailer_admin",
      "retailer_member",
    ],
    title: "System Update: Scheduled Maintenance",
    message:
      "Platform will be offline for 2 hours on Dec 30 starting 2 AM EST.",
    timestamp: getDaysAgo(5),
    isRead: true,
    actionLink: "help-center",
    metadata: {},
  },

  // --- MISSING TYPES COVERAGE ---
  // P3: Campaign Ended
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.CAMPAIGN_STATUS,
    priority: "P3",
    targetRoles: ["brand_admin", "brand_member"],
    title: "Campaign Ended: Summer Solstice",
    message: "This campaign has expired and is now visible in History.",
    timestamp: getDaysAgo(10),
    isRead: true,
    actionLink: "campaign-detail",
  },
  // P3: System Info (Export)
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.SYSTEM_INFO,
    priority: "P3",
    targetRoles: ["brand_admin"],
    title: "Export Ready",
    message: 'Your "Retailer_Performance_Q3.csv" is ready to download.',
    timestamp: getTimeAgo(5), // 5 mins ago
    isRead: false,
    actionLink: "download",
  },
  // P3: Setup Reminder (Retailer)
  {
    id: generateId(),
    type: NOTIFICATION_TYPES.SYSTEM_INFO,
    priority: "P3",
    targetRoles: ["retailer_admin"],
    title: "Setup Reminder",
    message: "Import your customers to unlock email marketing features.",
    timestamp: getDaysAgo(6),
    isRead: false,
    actionLink: "settings-crm",
  },
];

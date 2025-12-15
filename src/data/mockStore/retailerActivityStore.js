import { campaignData } from "./campaignStore";
// Helper to get random campaigns for source data
const campaigns = campaignData.campaigns;

// Mock Retailer Activities
// MVP: Only based on Brand Campaigns
const ACTIVITIES = [
  {
    id: "act-001",
    internalName: "Summer Sale - VIP List",
    campaignId: "camp-001", // Linked to "A perfect pair..."
    brandId: "b-verragio",
    type: "email",
    status: "Sent",
    performance: { metric: "Open Rate", value: "25%" },
    updatedAt: "2025-12-14T10:00:00",
    scheduledDate: "2025-12-14T10:00:00",
    author: {
      name: "Sarah Owner",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    },
  },
  {
    id: "act-002",
    internalName: "Holiday Setup - Staff Training",
    campaignId: "camp-006", // Linked to "Diamond Guide"
    brandId: "b-verragio",
    type: "social",
    platform: "instagram",
    status: "Draft",
    performance: { metric: "--", value: "" },
    updatedAt: "2025-12-15T09:30:00",
    scheduledDate: null,
    author: {
      name: "Mike Manager",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
    },
  },
  {
    id: "act-003",
    internalName: "Rolex Deepsea Launch Post",
    campaignId: "camp-ext-002",
    brandId: "b-rolex",
    type: "social",
    platform: "facebook",
    status: "Scheduled",
    performance: { metric: "--", value: "" },
    updatedAt: "2025-12-13T16:45:00",
    scheduledDate: "2025-12-20T09:00:00", // Scheduled future
    author: {
      name: "Sarah Owner",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    },
  },
  {
    id: "act-004",
    internalName: "Cartier Panthère Blast",
    campaignId: "camp-ext-001",
    brandId: "b-cartier",
    type: "email",
    status: "Failed",
    performance: { metric: "Bounce", value: "80%" },
    updatedAt: "2025-11-20T11:00:00",
    scheduledDate: "2025-11-20T11:00:00",
    author: { name: "System", avatar: null },
  },
  {
    id: "act-005",
    internalName: "Mens Bands Promo",
    campaignId: "camp-014",
    brandId: "b-verragio",
    type: "sms",
    status: "Sent",
    performance: { metric: "Click Rate", value: "12%" },
    updatedAt: "2025-12-10T14:20:00",
    scheduledDate: "2025-12-10T14:20:00",
    author: {
      name: "Mike Manager",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
    },
  },
  {
    id: "act-006",
    internalName: "Verragio Viral Video",
    campaignId: "camp-001",
    brandId: "b-verragio",
    type: "social",
    platform: ["instagram", "facebook"],
    status: "Posted",
    performance: { metric: "Engagement", value: "1.4K" },
    updatedAt: "2025-12-08T11:00:00",
    scheduledDate: "2025-12-08T11:00:00",
    author: {
      name: "Sarah Owner",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    },
  },
  {
    id: "act-007",
    internalName: "Multi-Channel Push",
    campaignId: "camp-006",
    brandId: "b-verragio",
    type: "social",
    platform: ["instagram", "facebook", "x"],
    status: "Posted",
    performance: { metric: "Engagement", value: "425" },
    updatedAt: "2025-12-05T09:00:00",
    scheduledDate: "2025-12-05T09:00:00",
    author: {
      name: "Mike Manager",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
    },
  },
];

// Mock Credit Data
const CREDITS = [
  {
    brandName: "Verragio",
    brandId: "b-verragio",
    logo: "/mock/verragio/logo.jpg",
    total: 10000,
    used: 3000,
    status: "Active",
  }, // 30% used
  {
    brandName: "Rolex",
    brandId: "b-rolex",
    logo: null,
    total: 1000,
    used: 800,
    status: "Low",
  }, // 80% used
  {
    brandName: "Cartier",
    brandId: "b-cartier",
    logo: null,
    total: 2000,
    used: 2000,
    status: "Empty",
  }, // 100% used
];

export const retailerActivityData = {
  activities: ACTIVITIES,
  credits: CREDITS,
};

export const getCampaignById = (id) => campaigns.find((c) => c.id === id);

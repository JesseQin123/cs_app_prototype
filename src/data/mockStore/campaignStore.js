const coverImage_1 = "/mock/verragio/brand/campaigns/1/cover.png";
const coverImage_2 = "/mock/verragio/brand/campaigns/2/cover.png";
const coverImage_3 = "/mock/verragio/brand/campaigns/3/cover.png";
const coverImage_4 = "/mock/verragio/brand/campaigns/4/cover.png";
const coverImage_5 = "/mock/verragio/brand/campaigns/5/cover.png";
const coverImage_6 = "/mock/verragio/brand/campaigns/6/cover.png";
const coverImage_7 = "/mock/verragio/brand/campaigns/7/cover.png";
const coverImage_8 = "/mock/verragio/brand/campaigns/8/cover.png";
const coverImage_9 = "/mock/verragio/brand/campaigns/9/cover.png";
const coverImage_10 = "/mock/verragio/brand/campaigns/10/cover.png";
const coverImage_11 = "/mock/verragio/brand/campaigns/11/cover.png";
const coverImage_12 = "/mock/verragio/brand/campaigns/12/cover.png";
const coverImage_13 = "/mock/verragio/brand/campaigns/13/cover.png";
const coverImage_14 = "/mock/verragio/brand/campaigns/14/cover.png";
const coverImage_15 = "/mock/verragio/brand/campaigns/15/cover.png";
const coverImage_16 = "/mock/verragio/brand/campaigns/16/cover.png";
const coverImage_17 = "/mock/verragio/brand/campaigns/17/cover.png";

const mediaImage_1 = "/mock/verragio/brand/campaigns/1/product.jpg";
const mediaImage_2 = "/mock/verragio/brand/campaigns/2/product.jpg";
const mediaImage_3 = "/mock/verragio/brand/campaigns/3/product.jpg";
const mediaImage_4 = "/mock/verragio/brand/campaigns/4/product.jpg";
const mediaImage_5 = "/mock/verragio/brand/campaigns/5/product.png";
const mediaImage_6 = "/mock/verragio/brand/campaigns/6/product.jpg";
const mediaImage_7 = "/mock/verragio/brand/campaigns/7/product.jpg";

// External Covers for Other Brands
const ROLEX_COVER =
  "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?auto=format&fit=crop&q=80&w=800";
const CARTIER_COVER =
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800";
const PATEK_COVER =
  "https://images.unsplash.com/photo-1596568359553-a56de6970068?auto=format&fit=crop&q=80&w=800";
const OMEGA_COVER =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"; // Fixed URL

import { getMember } from "./memberStore";
import { LUXURY_RETAILERS } from "./retailerStore";

export const campaignData = {
  // 1. Master Campaign List
  // ORDER: Newest Created First
  campaigns: [
    // 1. Active / Pinned / Full Content / High Perf / Good
    {
      id: "camp-001",
      title: "A perfect pair in radiant yellow gold. 💛",
      description: `Celebrate your love story with two timeless designs:
💍 Tradition-250DFR – A classic engagement ring with Verragio’s signature detailing and unmatched craftsmanship.
💍 VWRD7703 – A bold men’s band featuring channel-set round diamonds for a look that’s strong, sleek, and sophisticated.
Together, they embody elegance, commitment, and individuality.
🔗 Explore more and schedule your private viewing at Verragio.com

#Verragio
#YellowGoldRing #EngagementRing
`,
      status: "Active",
      coverImage: coverImage_1,
      cover: "bg-rose-100",
      audience: "All Retailers",
      isPinned: true,
      updatePending: false,
      adoptionRate: 78,
      activityCount: 2100,
      downloadCount: 1350,
      metrics: {
        // New Granular Metrics
        retailerAdoption: {
          participants: 156,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 1350,
          publishes: 2100,
        },
        audienceReach: {
          emailOpens: 850000,
          socialImpressions: 1550000,
        },
        customerInteractions: {
          clicks: 5200,
          likes: 4500,
          comments: 350,
          shares: 2450,
          saves: 890,
        },
        // Legacy fallbacks (optional, keeping for safety)
        emailOpens: 850,
        socialImpressions: 45000,
        clicks: 320,
        likes: 1200,
        comments: 45,
        shares: 80,
      },
      overviewId: "active-high",
      contentId: "full-content",
      insightsId: "high-perf",
      adoptionId: "good",
      createdAt: "2025-11-26",
      startDate: "2025-11-26",
      endDate: "2026-3-15",
      brandId: "b-verragio",
      retailerUsage: { social: true, email: false, sms: false, download: true },
      templates: ["t-all-social", "t-2", "t-3"],
      assets: ["f-full-1"],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 2. Active / Pinned / Social Heavy / Avg Perf / Avg
    {
      id: "camp-002",
      title: "✨ Celebrate Love This Thanksgiving ✨Holiday Collection Launch",
      description:
        "Gratitude is all about cherishing the moments that truly matter, and what could be more meaningful than a love that stands the test of time? Our gorgeous bridal set, radiating in yellow gold, showcases an elegant oval-cut diamond engagement ring, perfectly complemented by a stunning diamond wedding band. For him, a stylish yellow gold band with channel-set diamonds offers a touch of refined sophistication, making this a perfect way to say 'I love you' this holiday season. ❤️",
      status: "Active",
      coverImage: coverImage_2,
      cover: "bg-amber-100",
      audience: "VIP Retailers",
      isPinned: true,
      updatePending: false,
      adoptionRate: 45,
      activityCount: 890,
      downloadCount: 0,
      metrics: {
        retailerAdoption: {
          participants: 45,
          totalInvited: 100,
        },
        totalUsage: {
          downloads: 250,
          publishes: 640,
        },
        audienceReach: {
          emailOpens: 400,
          socialImpressions: 12500,
        },
        customerInteractions: {
          clicks: 150,
          likes: 450,
          comments: 12,
          shares: 25,
          saves: 10,
        },
        emailOpens: 400,
        socialImpressions: 12500,
        clicks: 150,
        likes: 450,
        comments: 12,
        shares: 25,
      },
      overviewId: "active-high",
      contentId: "social-heavy",
      insightsId: "avg-perf", // Mocked below
      adoptionId: "avg",
      createdAt: "2025-11-25",
      startDate: "2025-11-25",
      endDate: "2026-02-28",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-1"],
      assets: [],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 3. Active / Full Content / High Perf / Poor
    {
      id: "camp-003",
      title: "Delicate or dramatic--you decide!",
      description:
        "Delicate or dramatic--you decide! The elegant twist of the Verragio 18k yellow gold and diamond braided hoop is made to be cherished.",
      status: "Active",
      coverImage: coverImage_3,
      cover: "bg-purple-100",
      audience: "Unspecified",
      isPinned: false,
      updatePending: false,
      adoptionRate: 25,
      activityCount: 80,
      downloadCount: 40,
      metrics: {
        retailerAdoption: {
          participants: 25,
          totalInvited: 100,
        },
        totalUsage: {
          downloads: 40,
          publishes: 40,
        },
        audienceReach: {
          emailOpens: 120,
          socialImpressions: 5000,
        },
        customerInteractions: {
          clicks: 45,
          likes: 80,
          comments: 5,
          shares: 2,
          saves: 1,
        },
        emailOpens: 120,
        socialImpressions: 5000,
        clicks: 45,
        likes: 80,
        comments: 5,
        shares: 2,
      },
      overviewId: "active-avg", // Reusing high for metrics structure, actual data differs by ID usually but mocking
      contentId: "full-content",
      insightsId: "high-perf",
      adoptionId: "poor",
      createdAt: "2025-11-20",
      startDate: "2025-11-20",
      endDate: "2026-02-14",
      brandId: "b-verragio",
      retailerUsage: { social: true, email: true, sms: true, download: true },
      templates: ["t-3", "t-5"],
      assets: ["f-full-2"],
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
    },
    // 4. Active / Files Only / Avg Perf / Avg
    {
      id: "camp-004",
      title: "LUMINO Collection. Pure brilliance.",
      description: `
An oval-cut diamond. Sleek white gold. Every detail is designed for those who value understated luxury and unparalleled craftsmanship.

This is more than an engagement ring—it’s a statement of your journey.

💍: Lumino-801-Oval {NEW}

#Verragio

#EngagementRing #DiamondRing
`,
      status: "Active",
      coverImage: coverImage_4,
      cover: "bg-blue-50",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 60,
      activityCount: 0,
      downloadCount: 1200,
      metrics: {
        retailerAdoption: {
          participants: 120,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 1200,
          publishes: 850,
        },
        audienceReach: {
          emailOpens: 15600,
          socialImpressions: 48000,
        },
        customerInteractions: {
          clicks: 1250,
          likes: 4200,
          comments: 180,
          shares: 450,
          saves: 120,
        },
      },
      overviewId: "active-avg",
      contentId: "files-only",
      insightsId: "avg-perf",
      adoptionId: "avg",
      createdAt: "2025-11-19",
      startDate: "2025-11-20",
      endDate: "Permanent",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: true,
      },
      templates: [],
      assets: ["f-full-1", "f-full-2"],
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
    },
    // --- Other Strategies (Rolex, Cartier, etc) ---
    // 18. Cartier (Expiring Soon)
    {
      id: "camp-ext-001",
      title: "Panthère de Cartier Collection",
      description:
        "The timeless icon returns. Push the new collection assets to your top clients.",
      status: "Active",
      coverImage: CARTIER_COVER, // External
      cover: "bg-red-50",
      audience: "All Retailers",
      isPinned: true,
      updatePending: false,
      adoptionRate: 85,
      activityCount: 3500,
      downloadCount: 1500,

      metrics: {
        retailerAdoption: {
          participants: 170,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 1500,
          publishes: 2100,
        },
        audienceReach: {
          emailOpens: 2500,
          socialImpressions: 120000,
        },
        customerInteractions: {
          clicks: 1500,
          likes: 3800,
          comments: 240,
          shares: 450,
          saves: 180,
        },
      },
      overviewId: "active-high",
      contentId: "full-content",
      insightsId: "high-perf",
      adoptionId: "good",
      brandId: "b-cartier",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      createdAt: "2025-11-20",
      startDate: "2025-11-01",
      endDate: "2025-11-27", // Expires tomorrow (1 day left)
      createdby: { name: "Cartier Admin", avatar: "C" },
      templates: ["t-1", "t-2"], // Mock linking
      assets: ["f-full-1"],
    },
    // 18b. Burberry (Expiring Soon & Unused)
    {
      id: "camp-ext-005",
      title: "Burberry Check Collection",
      description: "Iconic patterns for the holiday season.",
      status: "Active",
      coverImage:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800",
      cover: "bg-amber-100",
      brandId: "b-burberry", // Using explicit ID we will create
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      metrics: {
        retailerAdoption: {
          participants: 140,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 1000,
          publishes: 1200,
        },
        audienceReach: {
          emailOpens: 12000,
          socialImpressions: 55000,
        },
        customerInteractions: {
          clicks: 1800,
          likes: 4200,
          comments: 320,
          shares: 550,
          saves: 150,
        },
      },
      createdAt: "2025-11-25",
      startDate: "2025-11-25",
      endDate: "2025-11-28", // Expiring
      createdBy: { name: "Burberry Admin", avatar: "B" },
      templates: ["t-1", "t-3"],
      assets: [],
      // Standard Fields
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 70,
      activityCount: 2000,
      downloadCount: 1000,
      overviewId: "active-high",
      contentId: "full-content",
      insightsId: "high-perf",
      adoptionId: "good",
    },
    // 19. Rolex (New Arrival)
    {
      id: "camp-ext-002",
      title: "Rolex Deepsea Challenge",
      description: "The ultimate diver's watch. Assets for digital and print.",
      status: "Active",
      coverImage: ROLEX_COVER,
      cover: "bg-green-900",
      audience: "Select Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 10,
      activityCount: 10,
      downloadCount: 40,
      overviewId: "active-low",
      contentId: "files-only",
      insightsId: "med-perf",
      adoptionId: "poor",
      brandId: "b-rolex",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      metrics: {
        retailerAdoption: {
          participants: 20,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 40,
          publishes: 15,
        },
        audienceReach: {
          emailOpens: 200,
          socialImpressions: 1500,
        },
        customerInteractions: {
          clicks: 50,
          likes: 120,
          comments: 5,
          shares: 10,
          saves: 2,
        },
      },
      createdAt: "2025-11-25", // Yesterday
      startDate: "2025-11-25", // New Arrival
      endDate: "Permanent",
      createdBy: { name: "Rolex Admin", avatar: "R" },
      templates: ["t-1", "t-5"], // Added t-5
      assets: ["f-full-2"],
    },
    // 20. Patek Philippe (Active)
    {
      id: "camp-ext-003",
      title: "Nautilus Annual Calendar",
      description: "Focus on the Ref. 5726/1A-014. Blue dial elegance.",
      status: "Active",
      coverImage: PATEK_COVER,
      cover: "bg-slate-800",
      audience: "All Retailers",
      isPinned: false,
      updatePending: true,
      adoptionRate: 40,
      activityCount: 250,
      downloadCount: 50,
      overviewId: "active-avg",
      contentId: "social-heavy",
      insightsId: "avg-perf",
      adoptionId: "avg",
      brandId: "b-patek",
      retailerUsage: {
        social: true,
        email: false,
        sms: false,
        download: false,
      },
      metrics: {
        retailerAdoption: {
          participants: 80,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 50,
          publishes: 250,
        },
        audienceReach: {
          emailOpens: 4500,
          socialImpressions: 12500,
        },
        customerInteractions: {
          clicks: 350,
          likes: 890,
          comments: 45,
          shares: 120,
          saves: 30,
        },
      },
      createdAt: "2025-11-10",
      startDate: "2025-11-15",
      endDate: "2026-06-01",
      createdBy: { name: "Patek Admin", avatar: "P" },
      templates: ["t-1", "t-x"],
      assets: [],
    },
    // 21. Omega
    {
      id: "camp-ext-004",
      title: "Speedmaster '57",
      description: "Celebrating the 65th anniversary.",
      status: "Active", // Should be in Past tab
      coverImage: OMEGA_COVER,
      cover: "bg-gray-800",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 60,
      activityCount: 1000,
      downloadCount: 500,
      overviewId: "ended-avg",
      contentId: "full-content",
      insightsId: "avg-perf",
      adoptionId: "avg",
      brandId: "b-omega",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      metrics: {
        retailerAdoption: {
          participants: 120,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 500,
          publishes: 1000,
        },
        audienceReach: {
          emailOpens: 8500,
          socialImpressions: 48000,
        },
        customerInteractions: {
          clicks: 1200,
          likes: 3500,
          comments: 210,
          shares: 450,
          saves: 90,
        },
      },
      createdAt: "2025-11-24",
      startDate: "2025-11-26",
      endDate: "2026-2-20",
      createdBy: { name: "Omega Admin", avatar: "O" },
      templates: ["t-1", "t-2", "t-3"],
      assets: ["f-full-3"],
    },
    // 5. Scheduled
    {
      id: "camp-005",
      title: "Spring Renew",
      description: "Refresh your inventory with our spring collection.",
      status: "Scheduled",
      coverImage: coverImage_5,
      cover: "bg-green-100",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 0,
      activityCount: 0,
      downloadCount: 0,
      overviewId: "scheduled",
      contentId: "full-content",
      insightsId: "empty",
      adoptionId: "empty",
      createdAt: "2025-12-01",
      startDate: "2026-03-01",
      endDate: "2026-04-30",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-1"], // Added template to ensure icon
      assets: [],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 6. Draft
    {
      id: "camp-006",
      title: "Diamond Guide 2026",
      description: "Educational guide for staff and customers.",
      status: "Draft",
      coverImage: coverImage_6,
      cover: "bg-slate-100",
      audience: "Staff Training",
      isPinned: false,
      updatePending: false,
      adoptionRate: null,
      activityCount: null,
      downloadCount: null,
      overviewId: "draft",
      contentId: "draft-empty",
      insightsId: "empty",
      adoptionId: "empty",
      createdAt: "2025-11-30",
      startDate: "TBD",
      endDate: "Permanent",
      brandId: "b-verragio",
      retailerUsage: { social: true, email: false, sms: false, download: true },
      templates: ["t-1"],
      assets: [],
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
    },
    // 7. Ended
    {
      id: "camp-007",
      title: "Autumn Gold",
      description: "Fall season specific marketing assets.",
      status: "Ended",
      coverImage: coverImage_7,
      cover: "bg-orange-100",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 88, // 88%
      activityCount: 3000,
      downloadCount: 1500,
      metrics: {
        retailerAdoption: {
          participants: 158,
          totalInvited: 180,
        },
        totalUsage: {
          downloads: 1450,
          publishes: 2100,
        },
        audienceReach: {
          emailOpens: 1200000,
          socialImpressions: 3500000,
        },
        customerInteractions: {
          clicks: 15200,
          likes: 8900,
          comments: 1200,
          shares: 4500,
          saves: 2100,
        },
      },
      overviewId: "ended-high",
      contentId: "full-content",
      insightsId: "high-perf",
      adoptionId: "good",
      createdAt: "2025-09-01",
      startDate: "2025-09-01",
      endDate: "2025-11-20",
      brandId: "b-verragio",
      retailerUsage: { social: true, email: true, sms: true, download: true },
      templates: ["t-2", "t-3"],
      assets: ["f-full-3"],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 8. Scheduled
    {
      id: "camp-008",
      title: "Mother's Day Early Bird",
      description: "Early access assets for Mother's Day planning.",
      status: "Scheduled",
      coverImage: coverImage_8,
      cover: "bg-pink-100",
      audience: "VIP Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 0,
      activityCount: 0,
      downloadCount: 0,
      overviewId: "scheduled",
      contentId: "social-heavy",
      insightsId: "empty",
      adoptionId: "empty",
      createdAt: "2025-11-28",
      startDate: "2026-04-01",
      endDate: "2026-05-10",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-1", "t-2"], // Added template
      assets: [],
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
    },
    // 9. Active
    {
      id: "camp-009",
      title: "Classic Bands",
      description: "Evergreen content for our classic wedding bands.",
      status: "Active",
      coverImage: coverImage_9,
      cover: "bg-gray-200",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 65,
      activityCount: 1800,
      downloadCount: 300,
      overviewId: "active-avg",
      contentId: "files-only",
      insightsId: "avg-perf",
      adoptionId: "avg",
      createdAt: "2025-11-27",
      startDate: "2025-01-01",
      endDate: "Permanent",
      brandId: "b-verragio",
      retailerUsage: {
        social: true,
        email: false,
        sms: false,
        download: false,
      },
      metrics: {
        retailerAdoption: {
          participants: 130,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 300,
          publishes: 1500,
        },
        audienceReach: {
          emailOpens: 45000,
          socialImpressions: 120000,
        },
        customerInteractions: {
          clicks: 850,
          likes: 2400,
          comments: 150,
          shares: 300,
          saves: 85,
        },
      },
      templates: ["t-3", "t-x"], // Added templates
      assets: ["f-full-3"],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 10. Archived
    {
      id: "camp-010",
      title: "Summer 2025 Clearance",
      description: "Old assets from the summer sale.",
      status: "Archived",
      coverImage: coverImage_10,
      cover: "bg-yellow-100",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 55,
      activityCount: 1000,
      downloadCount: 500,
      overviewId: "ended-avg",
      contentId: "full-content",
      insightsId: "avg-perf",
      adoptionId: "poor",
      createdAt: "2025-11-26",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-2"], // Added template
      assets: [],
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
    },
    // 11. Active
    {
      id: "camp-011",
      title: "Platinum Perfection",
      description: "Highlighting our platinum range.",
      status: "Active",
      coverImage: coverImage_11,
      cover: "bg-slate-300",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 42,
      activityCount: 600,
      downloadCount: 200,
      overviewId: "active-avg",
      contentId: "social-heavy",
      insightsId: "avg-perf",
      adoptionId: "poor",
      createdAt: "2025-11-25",
      startDate: "2025-11-26",
      endDate: "2026-03-31",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      metrics: {
        retailerAdoption: {
          participants: 84,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 200,
          publishes: 450,
        },
        audienceReach: {
          emailOpens: 12000,
          socialImpressions: 35000,
        },
        customerInteractions: {
          clicks: 420,
          likes: 1200,
          comments: 45,
          shares: 120,
          saves: 60,
        },
      },
      templates: ["t-2"], // Added template
      assets: [],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 12. Active
    {
      id: "camp-012",
      title: "Rose Gold Romance",
      description: "Targeting the romantic demographic.",
      status: "Active",
      coverImage: coverImage_12,
      cover: "bg-rose-200",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 81,
      activityCount: 2800,
      downloadCount: 400,
      overviewId: "active-high",
      contentId: "full-content",
      insightsId: "high-perf",
      adoptionId: "good",
      createdAt: "2025-11-24",
      startDate: "2025-09-15",
      endDate: "2026-02-14",
      brandId: "b-verragio",
      retailerUsage: { social: true, email: true, sms: false, download: false },
      metrics: {
        retailerAdoption: {
          participants: 162,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 400,
          publishes: 2400,
        },
        audienceReach: {
          emailOpens: 89000,
          socialImpressions: 210000,
        },
        customerInteractions: {
          clicks: 2800,
          likes: 6500,
          comments: 320,
          shares: 900,
          saves: 450,
        },
      },
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
      templates: ["t-1", "t-2", "t-3"],
      assets: [],
    },
    // 13. Draft
    {
      id: "camp-013",
      title: "Sustainability Initiative",
      description: "Communicating our green efforts.",
      status: "Draft",
      coverImage: coverImage_13,
      cover: "bg-emerald-100",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: null,
      activityCount: null,
      downloadCount: null,
      overviewId: "draft",
      contentId: "draft-empty",
      insightsId: "empty",
      adoptionId: "empty",
      createdAt: "2025-11-23",
      startDate: "TBD",
      endDate: "Permanent",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-ins-x"], // Added template
      assets: [],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 14. Active
    {
      id: "camp-014",
      title: "Men's Wedding Bands",
      description: "Focus on the groom.",
      status: "Active",
      coverImage: coverImage_14,
      cover: "bg-gray-600",
      audience: "All Retailers",
      isPinned: false,
      updatePending: true,
      adoptionRate: 50,
      activityCount: 900,
      downloadCount: 200,
      overviewId: "active-avg",
      contentId: "files-only",
      insightsId: "avg-perf",
      adoptionId: "avg",
      createdAt: "2025-11-24",
      startDate: "2025-11-26",
      endDate: "Permanent",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-x-google"], // Added template
      assets: ["f-full-1"],
      metrics: {
        retailerAdoption: {
          participants: 100,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 200,
          publishes: 700,
        },
        audienceReach: {
          emailOpens: 25000,
          socialImpressions: 80000,
        },
        customerInteractions: {
          clicks: 650,
          likes: 1800,
          comments: 90,
          shares: 200,
          saves: 110,
        },
      },
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
    },
    // 15. Archived
    {
      id: "camp-015",
      title: "Black Friday 2024",
      description: "Past Black Friday assets.",
      status: "Archived",
      coverImage: coverImage_15,
      cover: "bg-black",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 95,
      activityCount: 5000,
      downloadCount: 1700,
      overviewId: "ended-high",
      contentId: "full-content",
      insightsId: "high-perf",
      adoptionId: "good",
      createdAt: "2025-11-21",
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      brandId: "b-verragio",
      retailerUsage: { social: true, email: true, sms: true, download: true },
      templates: ["t-all-social"],
      assets: ["f-full-1"],
      metrics: {
        retailerAdoption: {
          participants: 190,
          totalInvited: 200,
        },
        totalUsage: {
          downloads: 1700,
          publishes: 3300,
        },
        audienceReach: {
          emailOpens: 500000,
          socialImpressions: 2500000,
        },
        customerInteractions: {
          clicks: 4000,
          likes: 12000,
          comments: 500,
          shares: 800,
          saves: 300,
        },
      },
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
    // 16. Active
    {
      id: "camp-016",
      title: "Anniversary Collection",
      description: "Celebrating 20 years of excellence.",
      status: "Active",
      coverImage: coverImage_16,
      cover: "bg-purple-200",
      audience: "VIP Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 68,
      activityCount: 2000,
      downloadCount: 400,
      overviewId: "active-avg",
      contentId: "social-heavy",
      insightsId: "avg-perf",
      adoptionId: "avg",
      createdAt: "2025-11-20",
      startDate: "2025-05-01",
      endDate: "2026-05-01",
      brandId: "b-verragio",
      retailerUsage: {
        social: true,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-all-social"], // Added template
      assets: [],
      createdBy: {
        name: getMember("u-admin").name,
        avatar: getMember("u-admin").avatarUrl,
      },
    },
    // 17. Active
    {
      id: "camp-017",
      title: "Gemstone Gala",
      description: "Colorful stones for the season.",
      status: "Active",
      coverImage: coverImage_17,
      cover: "bg-indigo-100",
      audience: "All Retailers",
      isPinned: false,
      updatePending: false,
      adoptionRate: 30,
      activityCount: 300,
      downloadCount: 100,
      overviewId: "active-low",
      contentId: "full-content",
      insightsId: "med-perf", // Maps to med-perf below if added
      adoptionId: "poor",
      createdAt: "2025-11-19",
      startDate: "2025-11-01",
      endDate: "2026-01-31",
      brandId: "b-verragio",
      retailerUsage: {
        social: false,
        email: false,
        sms: false,
        download: false,
      },
      templates: ["t-7"], // Added template
      assets: [],
      createdBy: {
        name: getMember("u-guest").name,
        avatar: getMember("u-guest").avatarUrl,
      },
    },
  ],

  // Global Mock Templates/Files for List Views
  publishableContent: [
    { id: "t-1", type: "social", platforms: ["instagram", "facebook"] },
    { id: "t-2", type: "email" },
    { id: "t-3", type: "sms" },
    { id: "t-x", type: "social", platforms: ["x"] },
    { id: "t-x-google", type: "social", platforms: ["x", "google"] },
    { id: "t-ins-x", type: "social", platforms: ["instagram", "x"] },
    {
      id: "t-ins-x-google",
      type: "social",
      platforms: ["instagram", "x", "google"],
    },
    {
      id: "t-all-social",
      type: "social",
      platforms: ["instagram", "facebook", "x", "google"],
    },
  ],
  downloadableFiles: [
    { id: "f-full-1", type: "image/jpeg", name: "Campaign_Hero.jpg" },
    { id: "f-full-2", type: "application/pdf", name: "Lookbook.pdf" },
    { id: "f-full-3", type: "video/mp4", name: "Social_Teaser.mp4" },
    { id: "f-1", type: "image/png", name: "Banner.png" },
  ],

  // 2. Tab Data: Overview Maps
  overviewMap: {
    draft: {
      status: "Draft",
      completion: 25,
      nextStep: "Upload Assets",
      timeline: { start: null, end: null },
      summary: "Campaign is in setup phase.",
      metrics: null,
    },
    scheduled: {
      status: "Scheduled",
      completion: 100,
      nextStep: "Auto-publish on Jan 5",
      timeline: { start: "2026-01-05", end: "2026-02-28" },
      summary: "Ready for launch. All assets approved.",
      metrics: null, // Scheduled usually matches Draft/Empty metrics until live
    },
    "active-high": {
      status: "Active",
      completion: 100,
      nextStep: "Monitor Performance",
      timeline: { start: "2025-11-15", end: "2026-01-15" },
      summary: "Performing above average. Strong adoption in Northeast.",
      metrics: {
        retailersActive: 142,
        totalRetailers: 180,
        adoptionRate: 78,
        totalViews: 4520,
        downloads: 3450,
        shares: 1200,
        timeLeft: "22 Days", // Optional override
      },
      needsAttention: [
        { name: "Nordstrom (Seattle)", adoptionRate: 10, lastActive: "2d ago" },
        { name: "Macy's (Herald Sq)", adoptionRate: 15, lastActive: "4h ago" },
        {
          name: "Bloomingdale's (SoHo)",
          adoptionRate: 20,
          lastActive: "1d ago",
        },
      ],
      topPerformingContent: [
        {
          title: "Summer_Vibe_Post_01",
          type: "image",
          metricLabel: "Most Shared",
          thumbnail: coverImage_1,
        },
        {
          title: "Lookbook_2025.pdf",
          type: "file",
          metricLabel: "Most Downloaded",
          thumbnail: coverImage_4, // Using a different cover as thumbnail mock
        },
      ],
      activityFeed: [
        {
          id: 1,
          retailer: "Neiman Marcus",
          initials: "NM",
          action: "sent the Email Campaign.",
          time: "15 mins ago",
        },
        {
          id: 2,
          retailer: "Galeries Lafayette",
          initials: "GL",
          action: "downloaded Lookbook.pdf.",
          time: "30 mins ago",
        },
        {
          id: 3,
          retailer: "Saks Fifth Avenue",
          initials: "SFA",
          action: "published to Instagram.",
          time: "45 mins ago",
        },
        {
          id: 4,
          retailer: "Lane Crawford",
          initials: "LC",
          action: "viewed the campaign.",
          time: "1 hour ago",
        },
        {
          id: 5,
          retailer: "Bergdorf Goodman",
          initials: "BG",
          action: "shared on Facebook.",
          time: "1 hour ago",
        },
      ],
    },
    "active-avg": {
      status: "Active",
      completion: 100,
      nextStep: "Boost Adoption",
      timeline: { start: "2025-07-01", end: "2025-09-30" },
      summary:
        "Steady performance. Suggest re-sending invite to inactive retailers.",
      metrics: {
        retailersActive: 85,
        totalRetailers: 180,
        adoptionRate: 47,
        totalViews: 2100,
        downloads: 1200,
        shares: 450,
        timeLeft: "45 Days",
      },
      needsAttention: [
        {
          name: "Ben Bridge (Bellevue)",
          adoptionRate: 5,
          lastActive: "5d ago",
        },
        {
          name: "Helzberg (Disney Springs)",
          adoptionRate: 12,
          lastActive: "1w ago",
        },
        { name: "Reeds (Wilmington)", adoptionRate: 18, lastActive: "3d ago" },
      ],
      topPerformingContent: [
        {
          title: "Holiday_Promo_Video.mp4",
          type: "video",
          metricLabel: "Most Viewed",
          thumbnail: coverImage_2,
        },
        {
          title: "Engagement_Ring_Guide.pdf",
          type: "file",
          metricLabel: "Most Downloaded",
          thumbnail: coverImage_5,
        },
      ],
      activityFeed: [
        {
          id: 1,
          retailer: "Neiman Marcus",
          initials: "NM",
          action: "sent the Email Campaign.",
          time: "15 mins ago",
        },
        {
          id: 2,
          retailer: "Galeries Lafayette",
          initials: "GL",
          action: "downloaded Lookbook.pdf.",
          time: "30 mins ago",
        },
      ],
    },
    "ended-avg": {
      // Added this new key referenced in Camp 4
      status: "Ended",
      completion: 100,
      nextStep: "View Final Report",
      timeline: { start: "2025-07-01", end: "2025-09-30" },
      summary: "Campaign concluded with average engagement.",
      metrics: {
        retailersActive: 70,
        totalRetailers: 180,
        adoptionRate: 38,
        totalViews: 1800,
        downloads: 900,
        shares: 300,
        finalRoi: "2.1x",
        timeLeft: "Ended",
      },
    },
    "ended-high": {
      status: "Ended",
      completion: 100,
      nextStep: "View Final Report",
      timeline: { start: "2025-03-01", end: "2025-04-30" },
      summary: "Campaign concluded with record engagement.",
      metrics: {
        retailersActive: 165,
        totalRetailers: 180,
        adoptionRate: 92,
        downloads: 5600,
        shares: 2300,
        finalRoi: "4.5x",
      },
    },
  },

  // 3. Tab Data: Content Maps (Assets)
  contentMap: {
    "draft-empty": {
      id: "draft-empty",
      publishable: [],
      downloadable: [],
    },
    "full-content": {
      id: "full-content",
      publishable: [
        {
          id: "t-soc-1",
          type: "social post",
          platform: ["instagram", "facebook"],
          caption: `A perfect pair in radiant yellow gold. 💛

Celebrate your love story with two timeless designs:
💍 Tradition-250DFR – A classic engagement ring with Verragio’s signature detailing and unmatched craftsmanship.
💍 VWRD7703 – A bold men’s band featuring channel-set round diamonds for a look that’s strong, sleek, and sophisticated.
Together, they embody elegance, commitment, and individuality.

🔗 Explore more and schedule your private viewing at Verragio.com

#Verragio
#YellowGoldRing #EngagementRing`,
          image: mediaImage_1,
          lastEdited: "2 days ago",
        },
        {
          id: "t-soc-2",
          type: "social post",
          platform: ["x", "google business profile"],
          caption: `✨ Celebrate Love This Thanksgiving ✨

Gratitude is all about cherishing the moments that truly matter, and what could be more meaningful than a love that stands the test of time? Our gorgeous bridal set, radiating in yellow gold, showcases an elegant oval-cut diamond engagement ring, perfectly complemented by a stunning diamond wedding band. For him, a stylish yellow gold band with channel-set diamonds offers a touch of refined sophistication, making this a perfect way to say 'I love you' this holiday season. ❤️

💍: Couture-489OV, 489W & VWRD-7703 #Verragio

#HappyThanksgiving #Love`,
          image: mediaImage_2,
          lastEdited: "2 days ago",
        },
        {
          id: "t-email-1",
          type: "email",
          subject: "Exclusive Preview: Winter Bridal 2026",
          previewText: "Be the first to showcase our latest masterpieces...",
          lastEdited: "1 week ago",
        },
        {
          id: "t-sms-1",
          type: "sms",
          message:
            "Verragio: New Winter Collection is here! Check your portal for exclusive assets.",
          lastEdited: "1 week ago",
        },
      ],
      downloadable: Array.from({ length: 10 }).map((_, i) => ({
        id: `f-full-${i}`,
        name:
          i === 0 ? "Campaign_Master_Pack.zip" : `HighRes_Image_${i + 1}.jpg`,
        type: i === 0 ? "ZIP" : "Image",
        size: i === 0 ? "450 MB" : "12 MB",
        lastActivity: "3 days ago",
      })),
    },
    "social-heavy": {
      id: "social-heavy",
      publishable: [
        {
          id: "t-soc-h-1",
          type: "social post",
          platform: ["instagram"],
          caption: `Delicate or dramatic--you decide! The elegant twist of the Verragio 18k yellow gold and diamond braided hoop is made to be cherished.

ℹ️: J-0196222-YH

#Verragio

#DiamondEarrings`,
          image: mediaImage_3,
          lastEdited: "5 hours ago",
        },
        {
          id: "t-soc-h-2",
          type: "social post",
          platform: ["facebook", "x"],
          caption: `LUMINO Collection. Pure brilliance.

An oval-cut diamond. Sleek white gold. Every detail is designed for those who value understated luxury and unparalleled craftsmanship.

This is more than an engagement ring—it’s a statement of your journey.

💍: Lumino-801-Oval {NEW}

#Verragio

#EngagementRing #DiamondRing`,
          image: mediaImage_4,
          lastEdited: "5 hours ago",
        },
      ],
      downloadable: Array.from({ length: 6 }).map((_, i) => ({
        id: `f-soc-${i}`,
        name: `Social_Asset_${i + 1}.png`,
        type: "Image",
        size: "5 MB",
        lastActivity: "1 day ago",
      })),
    },
    "files-only": {
      id: "files-only",
      publishable: [],
      downloadable: Array.from({ length: 15 }).map((_, i) => ({
        id: `f-only-${i}`,
        name:
          i % 2 === 0
            ? `Product_Spec_Sheet_${i + 1}.pdf`
            : `Marketing_Asset_${i + 1}.jpg`,
        type: i % 2 === 0 ? "PDF" : "Image",
        size: i % 2 === 0 ? "2 MB" : "15 MB",
        lastActivity: "1 week ago",
      })),
    },
    "email-only": {
      id: "email-only",
      publishable: [
        {
          id: "t-email-1",
          type: "email",
          subject: "Exclusive Preview: Winter Bridal 2026",
          previewText: "Be the first to showcase our latest masterpieces...",
          lastEdited: "1 week ago",
        },
      ],
      downloadable: [],
    },
  },

  // 4. Tab Data: Adoption Maps (Retailers)
  adoptionMap: {
    good: {
      id: "good",
      totalInvited: 32,
      joined: 32,
      adoptionRate: 100,
      needsAttentionCount: 0,
      zeroActionCount: 0,

      // Top Advocates: 5
      topAdvocates: [
        {
          id: "ta1",
          name: "Saks Fifth Avenue",
          avatar:
            "https://images.unsplash.com/photo-1541577141970-eebc83ebe30e?w=100&h=100&fit=crop",
          tier: "Platinum",
        },
        {
          id: "ta2",
          name: "Neiman Marcus",
          avatar:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
          tier: "Platinum",
        },
        {
          id: "ta3",
          name: "Bergdorf Goodman",
          avatar:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
          tier: "Gold",
        },
        {
          id: "ta4",
          name: "Nordstrom",
          avatar:
            "https://images.unsplash.com/photo-1485290334039-a3c69043e541?w=100&h=100&fit=crop",
          tier: "Gold",
        },
        {
          id: "ta5",
          name: "Bloomingdales",
          avatar:
            "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?w=100&h=100&fit=crop",
          tier: "Gold",
        },
      ],

      // Full List (32 items)
      list: Array.from({ length: 32 }).map((_, i) => {
        const estReach = i < 10 ? 5000 + i * 200 : 1500 + i * 100;
        return {
          id: `r-good-${i}`,
          name: LUXURY_RETAILERS[i % LUXURY_RETAILERS.length],
          tier: i < 10 ? "Platinum" : i < 20 ? "Gold" : "Silver",
          status: "Participated", // 100% Adoption
          usage:
            i < 20
              ? { social: true, email: true, downloads: true }
              : { social: true, email: false, downloads: true },
          actions: i < 10 ? 8 : 4, // High actions
          estReach: estReach,
          impact: `${(estReach / 1000).toFixed(1)}k Reach`,
          lastActive: "2 hours ago",
        };
      }),
    },

    avg: {
      id: "avg",
      totalInvited: 50,
      joined: 35, // 70%
      adoptionRate: 70,
      needsAttentionCount: 15,
      zeroActionCount: 15,

      // Top Advocates: 3
      topAdvocates: [
        { id: "ta1", name: "Harrods", tier: "Platinum" },
        { id: "ta2", name: "Selfridges", tier: "Platinum" },
        { id: "ta3", name: "Lane Crawford", tier: "Gold" },
      ],

      // Full List (50 items: 35 Active, 15 Inactive)
      list: Array.from({ length: 50 }).map((_, i) => {
        // Logic:
        // 0-34 (35): Participated
        // 35-39 (5): Viewed (Lazy)
        // 40-49 (10): Unopened (Zero Action)

        let tier = "Silver";
        if (i < 10) tier = "Platinum";
        else if (i < 25) tier = "Gold";
        else if (i >= 40) tier = "Platinum"; // Force high tier for unopened to show in Needs Attention

        let status = "Participated";
        if (i >= 35 && i < 40) status = "Viewed";
        if (i >= 40) status = "Unopened";

        const estReach = i < 35 ? 1200 + i * 50 : 0;
        const actions = i < 10 ? 6 : i < 35 ? 3 : 0;

        return {
          id: `r-avg-${i}`,
          name: LUXURY_RETAILERS[i % LUXURY_RETAILERS.length],
          tier,
          status,
          usage: i < 35 ? { social: i % 2 === 0, email: true } : {},
          actions: actions,
          estReach: estReach,
          impact: i < 35 ? `${(estReach / 1000).toFixed(1)}k Reach` : "-",
          lastActive: i < 35 ? "Yesterday" : i < 40 ? "3 days ago" : "-",
        };
      }),
    },

    poor: {
      id: "poor",
      totalInvited: 120,
      joined: 48, // 40%
      adoptionRate: 40,
      needsAttentionCount: 72,
      zeroActionCount: 72,

      // Top Advocates: 0
      topAdvocates: [],

      // Full List (120 items: 48 Active, 72 Inactive)
      list: Array.from({ length: 120 }).map((_, i) => {
        // 0-47: Participated
        // 48-59: Viewed
        // 60-119: Unopened

        let tier = "Silver";
        if (i < 15) tier = "Platinum";
        else if (i >= 48 && i < 55) tier = "Gold"; // Needs Attention candidates
        else if (i >= 60 && i < 70) tier = "Platinum"; // Needs Attention candidates

        let status = "Participated";
        if (i >= 48 && i < 60) status = "Viewed";
        if (i >= 60) status = "Unopened";

        const estReach = i < 48 ? 800 : 0;
        const actions = i < 48 ? 2 : 0;

        return {
          id: `r-poor-${i}`,
          name: LUXURY_RETAILERS[i % LUXURY_RETAILERS.length],
          tier,
          status,
          usage: i < 48 ? { downloads: true } : {},
          actions: actions,
          estReach: estReach,
          impact: i < 48 ? "0.8k Reach" : "-",
          lastActive: i < 48 ? "Last week" : "-",
        };
      }),
    },
  },

  // 5. Tab Data: Insights Maps (Performance)
  insightsMap: {
    empty: {
      hasData: false,
      message: "No performance data available yet.",
    },
    "high-perf": {
      hasData: true,
      totalReach: "1.2M",
      engagementRate: "4.8%",
      topRetailer: "Saks NYC",
      bestChannel: "Instagram",
      // Rich Content for ContentInsightsTab
      socialContent: [
        {
          id: "post-1",
          title: "Summer Collection Launch",
          thumbnail: mediaImage_5,
          platforms: ["instagram", "facebook"],
          totalShares: 445,
          estReach: 45000,
          avgEngagement: 4.8,
          details: [
            { platform: "instagram", shares: 85, likes: 3200, comments: 145 },
            { platform: "facebook", shares: 35, reactions: 850, comments: 42 },
          ],
        },
        {
          id: "post-2",
          title: "Behind the Scenes Video",
          thumbnail: mediaImage_6,
          platforms: ["twitter", "instagram"],
          totalShares: 280,
          estReach: 125000,
          avgEngagement: 7.2,
          details: [
            { platform: "twitter", shares: 190, views: 85000, likes: 12400 },
            { platform: "instagram", shares: 90, views: 32000, likes: 4500 },
          ],
        },
        {
          id: "post-3",
          title: "Store Event Promo",
          thumbnail: mediaImage_7,
          platforms: ["google_business"],
          totalShares: 45,
          estReach: 12000,
          avgEngagement: 3.5,
          details: [
            {
              platform: "google_business",
              shares: 45,
              views: 8500,
              clicks: 320,
            },
          ],
        },
      ],
      emailContent: [
        {
          id: "email-1",
          subject: "VIP Invite: Summer Preview",
          sent: 450,
          openRate: 45,
          clickRate: 12,
          usageCount: 15,
        },
        {
          id: "email-2",
          subject: "Last Chance for Early Access",
          sent: 320,
          openRate: 38,
          clickRate: 8,
          usageCount: 10,
        },
        {
          id: "email-3",
          subject: "New Arrivals are Here",
          sent: 580,
          openRate: 25,
          clickRate: 4,
          usageCount: 22,
        },
      ],
      smsContent: [
        {
          id: "sms-1",
          message: "Your exclusive access code is here! Shop now.",
          sent: 1200,
          deliveryRate: 98.5,
          clickRate: 18.2,
          usageCount: 45,
        },
        {
          id: "sms-2",
          message: "Flash Sale starts in 1 hour. Don't miss out.",
          sent: 850,
          deliveryRate: 99.1,
          clickRate: 22.5,
          usageCount: 32,
        },
      ],
      assetContent: [
        {
          id: "asset-1",
          name: "Lookbook_Q3_2024.pdf",
          type: "PDF",
          size: "15 MB",
          downloads: 145,
          coverage: 80,
          lastActivity: "2h ago",
        },
        {
          id: "asset-2",
          name: "Campaign_Video_Main.mp4",
          type: "Video",
          size: "45 MB",
          downloads: 89,
          coverage: 65,
          lastActivity: "5h ago",
        },
        {
          id: "asset-3",
          name: "Social_Assets_Pack.zip",
          type: "ZIP",
          size: "128 MB",
          downloads: 210,
          coverage: 92,
          lastActivity: "10m ago",
        },
        {
          id: "asset-4",
          name: "Product_Shot_01.jpg",
          type: "Image",
          size: "2.4 MB",
          downloads: 56,
          coverage: 40,
          lastActivity: "1d ago",
        },
        {
          id: "asset-5",
          name: "Product_Shot_02.jpg",
          type: "Image",
          size: "2.2 MB",
          downloads: 48,
          coverage: 35,
          lastActivity: "1d ago",
        },
      ],
    },
    "avg-perf": {
      hasData: true,
      totalReach: "450K",
      engagementRate: "2.1%",
      topRetailer: "Nordstrom",
      bestChannel: "Email",
      // Rich Content for ContentInsightsTab
      socialContent: [
        {
          id: "post-1",
          title: "Summer Collection Launch",
          thumbnail: mediaImage_5,
          platforms: ["instagram", "facebook"],
          totalShares: 445,
          estReach: 45000,
          avgEngagement: 4.8,
          details: [
            { platform: "instagram", shares: 85, likes: 3200, comments: 145 },
            { platform: "facebook", shares: 35, reactions: 850, comments: 42 },
          ],
        },
        {
          id: "post-2",
          title: "Behind the Scenes Video",
          thumbnail: mediaImage_6,
          platforms: ["twitter", "instagram"],
          totalShares: 280,
          estReach: 125000,
          avgEngagement: 7.2,
          details: [
            { platform: "twitter", shares: 190, views: 85000, likes: 12400 },
            { platform: "instagram", shares: 90, views: 32000, likes: 4500 },
          ],
        },
        {
          id: "post-3",
          title: "Store Event Promo",
          thumbnail: mediaImage_7,
          platforms: ["google_business"],
          totalShares: 45,
          estReach: 12000,
          avgEngagement: 3.5,
          details: [
            {
              platform: "google_business",
              shares: 45,
              views: 8500,
              clicks: 320,
            },
          ],
        },
      ],
      emailContent: [
        {
          id: "email-1",
          subject: "VIP Invite: Summer Preview",
          sent: 450,
          openRate: 45,
          clickRate: 12,
          usageCount: 15,
        },
        {
          id: "email-2",
          subject: "Last Chance for Early Access",
          sent: 320,
          openRate: 38,
          clickRate: 8,
          usageCount: 10,
        },
        {
          id: "email-3",
          subject: "New Arrivals are Here",
          sent: 580,
          openRate: 25,
          clickRate: 4,
          usageCount: 22,
        },
      ],
      smsContent: [
        {
          id: "sms-1",
          message: "Your exclusive access code is here! Shop now.",
          sent: 1200,
          deliveryRate: 98.5,
          clickRate: 18.2,
          usageCount: 45,
        },
        {
          id: "sms-2",
          message: "Flash Sale starts in 1 hour. Don't miss out.",
          sent: 850,
          deliveryRate: 99.1,
          clickRate: 22.5,
          usageCount: 32,
        },
      ],
      assetContent: [
        {
          id: "asset-1",
          name: "Lookbook_Q3_2024.pdf",
          type: "PDF",
          size: "15 MB",
          downloads: 145,
          coverage: 80,
          lastActivity: "2h ago",
        },
        {
          id: "asset-2",
          name: "Campaign_Video_Main.mp4",
          type: "Video",
          size: "45 MB",
          downloads: 89,
          coverage: 65,
          lastActivity: "5h ago",
        },
        {
          id: "asset-3",
          name: "Social_Assets_Pack.zip",
          type: "ZIP",
          size: "128 MB",
          downloads: 210,
          coverage: 92,
          lastActivity: "10m ago",
        },
        {
          id: "asset-4",
          name: "Product_Shot_01.jpg",
          type: "Image",
          size: "2.4 MB",
          downloads: 56,
          coverage: 40,
          lastActivity: "1d ago",
        },
        {
          id: "asset-5",
          name: "Product_Shot_02.jpg",
          type: "Image",
          size: "2.2 MB",
          downloads: 48,
          coverage: 35,
          lastActivity: "1d ago",
        },
      ],
    },
  },
};

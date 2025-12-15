// Mock Store for Retailer Activity Performance (PRD Implementation)

// Helper to get random avatar
const getAvatar = (seed) =>
  `https://ui-avatars.com/api/?name=${seed}&background=random&color=fff`;

// Mock CRM Contacts
const CONTACTS = [
  {
    id: "c1",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    avatar: getAvatar("Mike Chen"),
  },
  {
    id: "c2",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    avatar: getAvatar("Sarah Jenkins"),
  },
  {
    id: "c3",
    name: "David Miller",
    email: "david.m@example.com",
    avatar: getAvatar("David Miller"),
  },
  {
    id: "c4",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    avatar: getAvatar("Emma Wilson"),
  },
  {
    id: "c5",
    name: "James Rodriquez",
    email: "james.r@example.com",
    avatar: getAvatar("James Rodriquez"),
  },
  {
    id: "c6",
    name: "Lisa Wong",
    email: "lisa.w@example.com",
    avatar: getAvatar("Lisa Wong"),
  },
];

/**
 * Get detailed performance data for a specific activity
 * @param {string} activityId
 * @param {string} type - 'email' | 'social'
 */
export const getActivityPerformance = (activityId, type) => {
  // Simulate API delay locally if needed, but here we return standard objects

  // Default metadata
  const baseData = {
    id: activityId,
    thumbnail:
      type === "email"
        ? "https://images.unsplash.com/photo-1596524430615-b46476dd9fe8?auto=format&fit=crop&w=150&q=80"
        : "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=150&q=80",
    internalName: "Summer VIP Invite 2025",
    sentAt: "Dec 12, 10:00 AM",
    campaignName: "Summer Sale 2025",
    campaignId: "cmp-001",
    status: "Sent", // or Posted
    type: type, // Vital for UI logic (Drawer closing animation)
  };

  if (type === "email") {
    return {
      ...baseData,
      status: "Sent",
      metrics: {
        deliveryRate: "98.5%",
        openRate: "42.3%",
        clickRate: "12.8%",
        unsubscribes: 3,

        // Raw counts for tooltips
        sent: 1250,
        delivered: 1231,
        uniqueOpens: 520,
        uniqueClicks: 158,
      },
      actionableList: [
        // Hot Leads (Clicked)
        {
          id: "al-1",
          contact: CONTACTS[0],
          status: 'Clicked "Shop Collection"',
          time: "2h ago",
          type: "clicked",
        },
        {
          id: "al-2",
          contact: CONTACTS[2],
          status: 'Clicked "View Catalog"',
          time: "5h ago",
          type: "clicked",
        },
        {
          id: "al-3",
          contact: CONTACTS[5],
          status: 'Clicked "Book Appointment"',
          time: "1d ago",
          type: "clicked",
        },

        // Warm (Opened)
        {
          id: "al-4",
          contact: CONTACTS[1],
          status: "Opened email",
          time: "10m ago",
          type: "opened",
        },
        {
          id: "al-5",
          contact: CONTACTS[3],
          status: "Opened email",
          time: "3h ago",
          type: "opened",
        },

        // Bounced
        {
          id: "al-6",
          contact: { name: "Unknown", email: "fake.email@test.com" },
          status: "Bounced (Address not found)",
          time: "Dec 12",
          type: "bounced",
        },
      ],
      trends: Array.from({ length: 14 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          openRate: Math.floor(Math.random() * 20) + 30, // 30-50%
          clickRate: Math.floor(Math.random() * 10) + 5, // 5-15%
          deliveryRate: Math.floor(Math.random() * 2) + 98, // 98-100%
        };
      }),
    };
  }

  if (type === "social") {
    return {
      ...baseData,
      status: "Posted",
      metrics: {
        reach: 4520,
        engagement: 185, // Likes + Comments + Shares
        likes: 152,
        comments: 28,
        shares: 5,
      },
      actionableList: [
        // Comments
        {
          id: "c-1",
          user: { name: "sarah_j_style", avatar: "" },
          content: "Do you have this in size 6?",
          time: "2h ago",
          type: "comment",
        },
        {
          id: "c-2",
          user: { name: "mike_watch_guy", avatar: "" },
          content: "Price please?",
          time: "5h ago",
          type: "comment",
        },
        {
          id: "c-3",
          user: { name: "luxury_lover_99", avatar: "" },
          content: "Stunning piece! 😍",
          time: "1d ago",
          type: "comment",
        },
      ],
      trends: Array.from({ length: 14 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          engagement: Math.floor(Math.random() * 50) + 20,
          reach: Math.floor(Math.random() * 500) + 200,
          likes: Math.floor(Math.random() * 40) + 10,
        };
      }),
    };
  }

  // Default fallback
  return null;
};

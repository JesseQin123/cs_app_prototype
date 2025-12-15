export const LUXURY_RETAILERS = [
  "Alson Jewelers",
  "Brent L. Miller Jewelers & Goldsmiths",
  "CD Peacock",
  "Clarkson Jewelers",
  "Davis Jewelers",
  "De Boulle Diamond & Jewelry",
  "DeVons Jewelers",
  "Feldmar Watch Co.",
  "Gunderson’s Jewelers",
  "Heller Jewelers",
  "Henne Jewelers",
  "J.R Dunn Jewelry",
  "James & Sons Fine Jewelers",
  "James Free Jewelers",
  "King Jewelers Fine Jewelry & Luxury",
  "Lee Michaels Fine Jewelry",
  "Leonardo Jewelers",
  "Little Switzerland",
  "Littlebirdms",
  "London Jewelers",
  "Long’s Jewelers",
  "Louis Anthony Jewelers",
  "Lux Bond & Green",
  "Manfredi Jewels",
  "MP Demetre Jewelers",
  "O.C. Tanner Jewelers",
  "Polacheck’s Jewelers",
  "Razny Jewelers",
  "REEDS Jewelers",
  "R.F. Moeller Jeweler",
  "Richter & Phillips Jewelers",
  "The 1916 Company",
  "TIVOL",
  "Tourneau | Bucherer",
  "Trout Fine Jewellers",
  "Walters & Hogsett Jewelers",
];

// --- Constants for Segmentation ---

export const zones = [
  { id: "z-ne", label: "North East" },
  { id: "z-se", label: "South East" },
  { id: "z-mw", label: "Midwest" },
  { id: "z-w", label: "West Coast" },
  { id: "z-sw", label: "South West" },
];

export const tiers = [
  { id: "t-1", label: "T1 - Strategic Partner" },
  { id: "t-2", label: "T2 - Growth Partner" },
  { id: "t-3", label: "T3 - Authorized Retailer" },
];

export const groups = [
  { id: "g-ijo", label: "IJO Members" },
  { id: "g-rjo", label: "RJO Members" },
  { id: "g-cbg", label: "CBG Members" },
];

// Helper to generate a consistent avatar
const getAvatar = (seed) =>
  `https://ui-avatars.com/api/?name=${seed}&background=random&color=fff`;

// Helper to pick random attributes
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickRandomSubset = (arr) => arr.filter(() => Math.random() > 0.7);

// Create Mock Retailers from the Global List
export const retailers = LUXURY_RETAILERS.map((name, index) => {
  const tier = index < 5 ? tiers[0] : index < 15 ? tiers[1] : tiers[2];
  const zone = pickRandom(zones);
  const retailerGroups = pickRandomSubset(groups); // A retailer can belong to multiple groups

  return {
    id: `r-${index + 1}`,
    name: name,
    location: "New York, NY", // Mock
    tier: tier.id,
    zone: zone.id,
    groups: retailerGroups,
    logo: getAvatar(name),
  };
});

// Logic to estimate retailer count based on filters
export const getRetailerCount = (filters = {}) => {
  const {
    zones: filterZones,
    tiers: filterTiers,
    groups: filterGroups,
  } = filters;

  // Start with all retailers
  let matches = retailers;

  // Filter by Zone
  if (filterZones && filterZones.length > 0) {
    matches = matches.filter((r) => filterZones.includes(r.zone));
  }

  // Filter by Tier
  if (filterTiers && filterTiers.length > 0) {
    matches = matches.filter((r) => filterTiers.includes(r.tier));
  }

  // Filter by Group (Must belong to at least one of the selected groups?)
  if (filterGroups && filterGroups.length > 0) {
    matches = matches.filter((r) =>
      r.groups.some((g) => filterGroups.includes(g.id))
    );
  }

  return matches.length;
};

// Create Mock Users for the Retailer App (Admin & Member)
// We'll attach them to the first retailer: "Alson Jewelers"
const primaryRetailer = retailers[0]; // Alson Jewelers

export const retailerUsers = [
  {
    id: "ru-admin",
    name: "Sarah Jenkins",
    email: `sarah@${primaryRetailer.name
      .replace(/\s+/g, "")
      .toLowerCase()}.com`,
    role: "Admin", // Admin
    storeId: primaryRetailer.id,
    storeName: primaryRetailer.name,
    avatarType: "image",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop",
    initials: "SJ",
  },
  {
    id: "ru-member",
    name: "Jason Smith",
    email: `jason@${primaryRetailer.name
      .replace(/\s+/g, "")
      .toLowerCase()}.com`,
    role: "Associate", // Member
    storeId: primaryRetailer.id,
    storeName: primaryRetailer.name,
    avatarType: "initials",
    initials: "JS",
  },
];

export const currentRetailerUser = retailerUsers[0]; // Default to Admin

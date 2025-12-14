import { campaignData } from "./campaignStore";
import { resourceData } from "./resourceStore";

// Helper to extract assets from campaigns
const getCampaignAssets = () => {
  // This is a simplified extraction. In a real app, this would be a DB query.
  // We are mocking specific file objects that align with the campaignStore "assets" array strings.
  // Current campaignStore uses strings like "f-full-1", so we define them here.
  return [
    {
      id: "f-img-1",
      name: "Summer_Campaign_Hero.jpg",
      type: "jpg",
      size: "2.4 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop",
    },
    {
      id: "f-img-2",
      name: "Product_Shot_Ring_Side.png",
      type: "png",
      size: "1.8 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-07",
      status: "active",
      url: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=200",
    },
    {
      id: "f-full-1",
      name: "Verragio_Spring2025_Campaign_Assets.zip",
      type: "zip",
      size: "1.2 GB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-05",
      status: "active",
    },
    {
      id: "f-full-2",
      name: "Verragio_Social_Media_Kit.zip",
      type: "zip",
      size: "450 MB",
      sourceType: "campaign",
      version: "v2.1",
      lastUpdated: "2025-11-25",
      status: "active",
    },
    {
      id: "f-full-3",
      name: "Classic_Bands_HighRes_Images.zip",
      type: "zip",
      size: "890 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-11-24",
      status: "active",
    },
    {
      id: "f-pdf-test",
      name: "m127334-0001.pdf",
      type: "pdf",
      size: "3.5 MB",
      sourceType: "campaign",
      version: "v1.2",
      lastUpdated: "2025-12-10",
      status: "active",
      // Assuming local file access if configured, otherwise might need explicit import or public folder.
      // For Vite, explicit import is safer or putting in public/. However, user specified src path.
      // We will assume imports work or are handled.
      // url: "/src/assets/mock/files/m127334-0001.pdf"
      // NOTE: In Vite, src assets usually need import. We'll use string path for now as per user instruction "file address is...".
      url: "/mock/files/m127334-0001.pdf",
    },
    {
      id: "f-webp-test",
      name: "banner-1.webp",
      type: "webp",
      size: "450 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-11",
      status: "active",
      url: "/mock/files/banner-1.webp",
    },
    {
      id: "f-jpg-test",
      name: "img-001.jpg",
      type: "jpg",
      size: "1.8 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-11",
      status: "active",
      url: "/mock/files/img-001.jpg",
    },
  ];
};

// Helper to extract files from resourceStore
const getResourceFiles = () => {
  // Flatten the nested files object from resourceStore
  const allFiles = [];
  Object.keys(resourceData.files).forEach((resId) => {
    const files = resourceData.files[resId];
    files.forEach((f) => {
      allFiles.push({
        ...f,
        sourceType: "resource",
        sourceId: resId, // Linking back to the resource folder
        version: "v1.0", // Default version
        lastUpdated: f.addedAt, // Mapping addedAt to lastUpdated for consistency
        status: "active",
      });
    });
  });
  return allFiles;
};

// Static definition of "Deleted" or "Updated" file scenarios for the history demo
const specialFiles = [
  {
    id: "f-deleted-01",
    name: "Old_Pricing_Sheet_2024.pdf",
    type: "pdf",
    size: "2.4 MB",
    sourceType: "resource",
    version: "v1.0",
    lastUpdated: "2024-01-15",
    status: "deleted", // Source deleted script
  },
  {
    id: "f-updated-01",
    name: "Diamond_Grading_Guide_2025.pdf",
    type: "pdf",
    size: "5.5 MB",
    sourceType: "resource",
    version: "v2.0", // New version exists
    lastUpdated: "2025-12-10",
    status: "active",
    previousVersionId: "f-updated-01-v1", // Concept link
  },
];

export const fileStore = [
  ...getCampaignAssets(),
  ...getResourceFiles(),
  ...specialFiles,
];

// Alias commonly expected name 'files' if deemed useful, but currently named 'fileStore'
export const files = fileStore;

export const getFileById = (id) => fileStore.find((f) => f.id === id);

export const addFile = (newFile) => {
  const fileEntry = {
    ...newFile,
    id: newFile.id || `f-new-${Date.now()}`,
    status: "active",
    lastUpdated: new Date().toISOString().split("T")[0],
    sourceType: newFile.sourceType || "upload",
    fileOrigin: newFile.isDerived ? "derived" : "upload",
    parentFileId: newFile.parentFileId || null,
  };
  fileStore.unshift(fileEntry);
  return fileEntry;
};

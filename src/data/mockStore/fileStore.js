import { resourceData } from "./resourceStore";

// Helper to extract assets from campaigns
const getCampaignAssets = () => {
  // This is a simplified extraction. In a real app, this would be a DB query.
  // We are mocking specific file objects that align with the campaignStore "assets" array strings.
  // Current campaignStore uses strings like "f-full-1", so we define them here.
  return [
    {
      id: "f-img-01",
      name: "M126729VTNR-0001_2501stojan_002_RVB_1080x1080.jpg",
      type: "jpg",
      size: "76 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/M126729VTNR-0001_2501stojan_002_RVB_1080x1080.jpg",
    },
    {
      id: "f-img-02",
      name: "M127285TBR-0002_2501fj_003_1080x1080.jpg",
      type: "jpg",
      size: "125 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/M127285TBR-0002_2501fj_003_1080x1080.jpg",
    },
    {
      id: "f-img-03",
      name: "M127334-0001_2501fj_001_1080x1080.jpg",
      type: "jpg",
      size: "69 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/M127334-0001_2501fj_001_1080x1080.jpg",
    },
    {
      id: "f-pdf-01",
      name: "Print_Article_2P_NP25_package.pdf",
      type: "pdf",
      size: "483 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/Print_Article_2P_NP25_package.pdf",
    },
    {
      id: "f-doc-01",
      name: "Print_Article_6P_NP25_package_en.docx",
      type: "doc",
      size: "24 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/Print_Article_6P_NP25_package_en.docx",
    },
    {
      id: "f-vid-01",
      name: "Rolex_MP_OLV_WATCHMAKING_MANIFESTO_en_1080x1080.mp4",
      type: "mp4",
      size: "11.2 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/Rolex_MP_OLV_WATCHMAKING_MANIFESTO_en_1080x1080.mp4",
    },
    {
      id: "f-vid-02",
      name: "Rolex_MP_OLV_WATCHMAKING_PRECISION_EN_1080x1920.mp4",
      type: "mp4",
      size: "24.6 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/Rolex_MP_OLV_WATCHMAKING_PRECISION_EN_1080x1920.mp4",
    },
    {
      id: "f-img-04",
      name: "alexander-andrews-anUOLC3zMD4-unsplash.jpg",
      type: "jpg",
      size: "5.8 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/alexander-andrews-anUOLC3zMD4-unsplash.jpg",
    },
    {
      id: "f-webp-01",
      name: "banner-1.webp",
      type: "webp",
      size: "60 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-11",
      status: "active",
      url: "/mock/files/banner-1.webp",
    },
    {
      id: "f-txt-01",
      name: "bltcb4f881468b7afa1_en-gb.txt",
      type: "txt",
      size: "1 KB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-08",
      status: "active",
      url: "/mock/files/bltcb4f881468b7afa1_en-gb.txt",
    },
    {
      id: "f-img-05",
      name: "img-001.jpg",
      type: "jpg",
      size: "1.4 MB",
      sourceType: "campaign",
      version: "v1.0",
      lastUpdated: "2025-12-11",
      status: "active",
      url: "/mock/files/img-001.jpg",
    },
    {
      id: "f-pdf-test",
      name: "m127334-0001.pdf",
      type: "pdf",
      size: "1.6 MB",
      sourceType: "campaign",
      version: "v1.2",
      lastUpdated: "2025-12-10",
      status: "active",
      url: "/mock/files/m127334-0001.pdf",
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

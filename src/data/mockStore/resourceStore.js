const cover1 = "/mock/verragio/brand/cover/cover1.png";
const cover2 = "/mock/verragio/brand/cover/cover2.png";
const cover3 = "/mock/verragio/brand/cover/cover3.png";
const cover4 = "/mock/verragio/brand/cover/cover4.png";
const cover5 = "/mock/verragio/brand/cover/cover5.png";
const cover6 = "/mock/verragio/brand/cover/cover6.png";

export const resourceData = {
  folders: [
    {
      id: "res-001",
      title: "Visual Merchandising 2025",
      coverImage: cover1,
      coverColor: "bg-neutral-100",
      status: "Visible", // Visible / Hidden
      audience: "All Retailers", // All Retailers / Platinum Only / Gold+
      updatedAt: "2d ago",
      fileCount: 15,
      isNew: true,
    },
    {
      id: "res-002",
      title: "Brand Identity Guidelines",
      coverImage: cover2,
      coverColor: "bg-indigo-50",
      status: "Visible",
      audience: "All Retailers",
      updatedAt: "1 week ago",
      fileCount: 4,
      isNew: false,
    },
    {
      id: "res-003",
      title: "Platinum Exclusive Assets",
      coverImage: cover3,
      coverColor: "bg-slate-800",
      status: "Visible",
      audience: "Platinum Only",
      updatedAt: "3d ago",
      fileCount: 8,
      isNew: true,
      isExclusive: true,
    },
    {
      id: "res-004",
      title: "Store Display Setup Guide",
      coverImage: cover4,
      coverColor: "bg-amber-50",
      status: "Hidden",
      audience: "All Retailers",
      updatedAt: "Just now",
      fileCount: 1,
      isNew: false,
    },
    {
      id: "res-005",
      title: "Q1 Marketing Claims",
      coverImage: cover5,
      coverColor: "bg-rose-50",
      status: "Visible",
      audience: "Gold+",
      updatedAt: "1 month ago",
      fileCount: 12,
      isNew: false,
    },
    {
      id: "res-006",
      title: "Staff Training Manuals",
      coverImage: cover6,
      coverColor: "bg-blue-50",
      status: "Visible",
      audience: "All Retailers",
      updatedAt: "2 weeks ago",
      fileCount: 6,
      isNew: false,
    },
  ],
  files: {
    "res-001": [
      {
        id: "res-f-img-01",
        name: "M126729VTNR-0001_2501stojan_002_RVB_1080x1080.jpg",
        type: "jpg",
        size: "76 KB",
        addedAt: "2d ago",
        url: "/mock/files/M126729VTNR-0001_2501stojan_002_RVB_1080x1080.jpg",
      },
      {
        id: "res-f-img-02",
        name: "M127285TBR-0002_2501fj_003_1080x1080.jpg",
        type: "jpg",
        size: "125 KB",
        addedAt: "2d ago",
        url: "/mock/files/M127285TBR-0002_2501fj_003_1080x1080.jpg",
      },
    ],
    "res-002": [
      {
        id: "res-f-pdf-01",
        name: "Print_Article_2P_NP25_package.pdf",
        type: "pdf",
        size: "483 KB",
        addedAt: "1 week ago",
        url: "/mock/files/Print_Article_2P_NP25_package.pdf",
      },
      {
        id: "res-f-doc-01",
        name: "Print_Article_6P_NP25_package_en.docx",
        type: "doc",
        size: "24 KB",
        addedAt: "1 week ago",
        url: "/mock/files/Print_Article_6P_NP25_package_en.docx",
      },
    ],
    "res-003": [
      {
        id: "res-f-vid-01",
        name: "Rolex_MP_OLV_WATCHMAKING_MANIFESTO_en_1080x1080.mp4",
        type: "mp4",
        size: "11.2 MB",
        addedAt: "3d ago",
        url: "/mock/files/Rolex_MP_OLV_WATCHMAKING_MANIFESTO_en_1080x1080.mp4",
      },
    ],
    "res-004": [
      {
        id: "res-f-vid-02",
        name: "Rolex_MP_OLV_WATCHMAKING_PRECISION_EN_1080x1920.mp4",
        type: "mp4",
        size: "24.6 MB",
        addedAt: "Just now",
        url: "/mock/files/Rolex_MP_OLV_WATCHMAKING_PRECISION_EN_1080x1920.mp4",
      },
    ],
    "res-005": [
      {
        id: "res-f-img-04",
        name: "alexander-andrews-anUOLC3zMD4-unsplash.jpg",
        type: "jpg",
        size: "5.8 MB",
        addedAt: "1 mo ago",
        url: "/mock/files/alexander-andrews-anUOLC3zMD4-unsplash.jpg",
      },
      {
        id: "res-f-txt-01",
        name: "bltcb4f881468b7afa1_en-gb.txt",
        type: "txt",
        size: "1 KB",
        addedAt: "1 mo ago",
        url: "/mock/files/bltcb4f881468b7afa1_en-gb.txt",
      },
    ],
    "res-006": [
      {
        id: "res-f-webp-01",
        name: "banner-1.webp",
        type: "webp",
        size: "60 KB",
        addedAt: "2w ago",
        url: "/mock/files/banner-1.webp",
      },
      {
        id: "res-f-img-05",
        name: "img-001.jpg",
        type: "jpg",
        size: "1.4 MB",
        addedAt: "2w ago",
        url: "/mock/files/img-001.jpg",
      },
    ],
  },
};

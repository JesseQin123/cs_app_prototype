/**
 * Export Mock Data to Vespa-compatible JSON format
 *
 * Usage: node scripts/export-to-vespa.js
 *
 * Output:
 *   - vespa-data/text-documents.json  (text data for Vespa indexing)
 *   - vespa-data/images-manifest.json (image metadata for CLIP embedding)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ============================================
// Data Definitions (inline to avoid module import issues)
// ============================================

const LUXURY_RETAILERS = [
  "Alson Jewelers",
  "Brent L. Miller Jewelers & Goldsmiths",
  "CD Peacock",
  "Clarkson Jewelers",
  "Davis Jewelers",
  "De Boulle Diamond & Jewelry",
  "DeVons Jewelers",
  "Feldmar Watch Co.",
  "Gunderson's Jewelers",
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
  "Long's Jewelers",
  "Louis Anthony Jewelers",
  "Lux Bond & Green",
  "Manfredi Jewels",
  "MP Demetre Jewelers",
  "O.C. Tanner Jewelers",
  "Polacheck's Jewelers",
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

const brands = [
  { id: "b-verragio", name: "Verragio", description: "Luxury engagement and wedding ring designer known for intricate detailing and exceptional craftsmanship." },
  { id: "b-gucci", name: "Gucci", description: "Italian luxury fashion house renowned for contemporary and eclectic designs." },
  { id: "b-louisvuitton", name: "Louis Vuitton", description: "French fashion house and luxury goods company known for leather goods and ready-to-wear." },
  { id: "b-dior", name: "Dior", description: "French luxury goods company known for haute couture, leather goods, and accessories." },
  { id: "b-hermes", name: "Hermès", description: "French luxury design house known for leather goods, lifestyle accessories, and perfumery." },
  { id: "b-prada", name: "Prada", description: "Italian luxury fashion house specializing in leather handbags, travel accessories, and fashion." },
  { id: "b-tiffany", name: "Tiffany & Co.", description: "American luxury jewelry and specialty retailer famous for diamond and sterling silver jewelry." },
  { id: "b-cartier", name: "Cartier", description: "French luxury goods conglomerate known for jewelry, watches, and accessories." },
  { id: "b-rolex", name: "Rolex", description: "Swiss luxury watch manufacturer known for precision timepieces and iconic designs." },
  { id: "b-patek", name: "Patek Philippe", description: "Swiss luxury watch manufacturer renowned for complicated mechanical watches." },
  { id: "b-omega", name: "Omega", description: "Swiss luxury watchmaker known for precision and as the official timekeeper of the Olympics." },
  { id: "b-burberry", name: "Burberry", description: "British luxury fashion house known for outerwear and iconic check pattern." },
];

const campaigns = [
  {
    id: "camp-001",
    title: "A perfect pair in radiant yellow gold",
    description: "Celebrate your love story with two timeless designs: Tradition-250DFR engagement ring and VWRD7703 men's band featuring channel-set round diamonds.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 78,
    coverImage: "/mock/verragio/brand/campaigns/1/cover.png",
  },
  {
    id: "camp-002",
    title: "Celebrate Love This Thanksgiving - Holiday Collection Launch",
    description: "Gratitude is all about cherishing the moments that truly matter. Our gorgeous bridal set radiating in yellow gold showcases an elegant oval-cut diamond engagement ring.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 45,
    coverImage: "/mock/verragio/brand/campaigns/2/cover.png",
  },
  {
    id: "camp-003",
    title: "Diamond Guide - Education Series",
    description: "Help your customers understand diamond quality with our comprehensive 4C education guide. Perfect for in-store displays and email campaigns.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 82,
    coverImage: "/mock/verragio/brand/campaigns/3/cover.png",
  },
  {
    id: "camp-004",
    title: "Holiday Gift Guide 2025",
    description: "Curated selection of engagement rings and wedding bands perfect for holiday proposals and gifts.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 65,
    coverImage: "/mock/verragio/brand/campaigns/4/cover.png",
  },
  {
    id: "camp-005",
    title: "Spring Essentials Collection",
    description: "Fresh designs for the spring season featuring floral-inspired settings and rose gold options.",
    brandId: "b-verragio",
    status: "Draft",
    adoptionRate: 0,
    coverImage: "/mock/verragio/brand/campaigns/5/cover.png",
  },
  {
    id: "camp-006",
    title: "Venetian Collection Spotlight",
    description: "Showcase the intricate scrollwork and signature Verragio beading of our Venetian collection.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 72,
    coverImage: "/mock/verragio/brand/campaigns/6/cover.png",
  },
  {
    id: "camp-007",
    title: "Couture Collection Launch",
    description: "Introducing our most sophisticated designs yet. The Couture collection features hand-set diamonds and exceptional craftsmanship.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 88,
    coverImage: "/mock/verragio/brand/campaigns/7/cover.png",
  },
  {
    id: "camp-008",
    title: "Valentine's Day Campaign",
    description: "Love is in the air. Promote our romantic designs perfect for Valentine's Day proposals.",
    brandId: "b-verragio",
    status: "Closed",
    adoptionRate: 91,
    coverImage: "/mock/verragio/brand/campaigns/8/cover.png",
  },
  {
    id: "camp-009",
    title: "Men's Wedding Band Collection",
    description: "Strong, sophisticated, and timeless. Explore our men's wedding band collection featuring various metals and styles.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 55,
    coverImage: "/mock/verragio/brand/campaigns/9/cover.png",
  },
  {
    id: "camp-010",
    title: "Engagement Ring Customization Guide",
    description: "Guide customers through our customization options. From metal choices to diamond settings.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 60,
    coverImage: "/mock/verragio/brand/campaigns/10/cover.png",
  },
  {
    id: "camp-011",
    title: "Anniversary Band Collection",
    description: "Celebrate milestone moments with our anniversary band collection. Perfect for upgrading or adding to a stack.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 48,
    coverImage: "/mock/verragio/brand/campaigns/11/cover.png",
  },
  {
    id: "camp-012",
    title: "Bridal Show Marketing Kit",
    description: "Everything you need for bridal show season. Display materials, lookbooks, and promotional assets.",
    brandId: "b-verragio",
    status: "Active",
    adoptionRate: 75,
    coverImage: "/mock/verragio/brand/campaigns/12/cover.png",
  },
  {
    id: "camp-013",
    title: "Rolex Oyster Perpetual Launch",
    description: "The new Oyster Perpetual collection featuring vibrant dial colors and refined aesthetics.",
    brandId: "b-rolex",
    status: "Active",
    adoptionRate: 85,
    coverImage: null,
  },
  {
    id: "camp-014",
    title: "Cartier Love Collection",
    description: "The iconic Love bracelet and matching accessories. Symbol of love that transcends time.",
    brandId: "b-cartier",
    status: "Active",
    adoptionRate: 70,
    coverImage: null,
  },
  {
    id: "camp-015",
    title: "Omega Seamaster Diver 300M",
    description: "Professional diving watches combining elegance with performance. Water resistant to 300 meters.",
    brandId: "b-omega",
    status: "Active",
    adoptionRate: 62,
    coverImage: null,
  },
  {
    id: "camp-016",
    title: "Tiffany Setting Campaign",
    description: "The engagement ring that started it all. Celebrate 130+ years of the iconic Tiffany Setting.",
    brandId: "b-tiffany",
    status: "Active",
    adoptionRate: 78,
    coverImage: "/mock/verragio/brand/campaigns/16/cover.png",
  },
  {
    id: "camp-017",
    title: "Patek Philippe Nautilus Collection",
    description: "The legendary Nautilus. Sporty elegance in its purest form.",
    brandId: "b-patek",
    status: "Active",
    adoptionRate: 58,
    coverImage: "/mock/verragio/brand/campaigns/17/cover.png",
  },
];

const resources = [
  { id: "res-001", title: "Visual Merchandising 2025", description: "Complete visual merchandising guidelines for 2025 including display setups and lighting recommendations.", fileCount: 15 },
  { id: "res-002", title: "Brand Identity Guidelines", description: "Official brand identity guidelines including logo usage, color palettes, and typography standards.", fileCount: 4 },
  { id: "res-003", title: "Platinum Exclusive Assets", description: "Premium marketing materials available only to Platinum tier retailers.", fileCount: 8 },
  { id: "res-004", title: "Store Display Setup Guide", description: "Step-by-step instructions for setting up in-store displays and product presentations.", fileCount: 1 },
  { id: "res-005", title: "Q1 Marketing Claims", description: "Approved marketing claims and product descriptions for Q1 campaigns.", fileCount: 12 },
  { id: "res-006", title: "Staff Training Manuals", description: "Comprehensive training materials for retail staff on product knowledge and sales techniques.", fileCount: 6 },
];

const zones = [
  { id: "z-ne", label: "North East" },
  { id: "z-se", label: "South East" },
  { id: "z-mw", label: "Midwest" },
  { id: "z-w", label: "West Coast" },
  { id: "z-sw", label: "South West" },
];

const tiers = [
  { id: "t-1", label: "T1 - Strategic Partner" },
  { id: "t-2", label: "T2 - Growth Partner" },
  { id: "t-3", label: "T3 - Authorized Retailer" },
];

// ============================================
// Document Conversion Functions
// ============================================

function convertBrandToVespa(brand) {
  return {
    fields: {
      id: brand.id,
      content_type: "brand",
      title: brand.name,
      body: brand.description,
      category: "luxury-brand",
      metadata: JSON.stringify({ brandId: brand.id }),
      image_file_name: "",
      created_at: Date.now(),
    }
  };
}

function convertCampaignToVespa(campaign) {
  const brand = brands.find(b => b.id === campaign.brandId);
  return {
    fields: {
      id: campaign.id,
      content_type: "campaign",
      title: campaign.title,
      body: campaign.description,
      category: `campaign-${campaign.status.toLowerCase()}`,
      metadata: JSON.stringify({
        brandId: campaign.brandId,
        brandName: brand?.name || "Unknown",
        status: campaign.status,
        adoptionRate: campaign.adoptionRate,
      }),
      image_file_name: campaign.coverImage ? path.basename(campaign.coverImage) : "",
      created_at: Date.now(),
    }
  };
}

function convertRetailerToVespa(retailer, index) {
  const tier = index < 5 ? tiers[0] : index < 15 ? tiers[1] : tiers[2];
  const zone = zones[index % zones.length];

  return {
    fields: {
      id: `retailer-${index + 1}`,
      content_type: "retailer",
      title: retailer,
      body: `${retailer} is a luxury jewelry retailer located in the ${zone.label} region. They are classified as a ${tier.label}.`,
      category: tier.id,
      metadata: JSON.stringify({
        tier: tier.id,
        tierLabel: tier.label,
        zone: zone.id,
        zoneLabel: zone.label,
      }),
      image_file_name: "",
      created_at: Date.now(),
    }
  };
}

function convertResourceToVespa(resource) {
  return {
    fields: {
      id: resource.id,
      content_type: "resource",
      title: resource.title,
      body: resource.description,
      category: "marketing-resource",
      metadata: JSON.stringify({ fileCount: resource.fileCount }),
      image_file_name: "",
      created_at: Date.now(),
    }
  };
}

// ============================================
// Image Manifest Generation
// ============================================

function generateImageManifest() {
  const images = [];
  const publicDir = path.join(projectRoot, 'public');

  // Add campaign cover images
  for (let i = 1; i <= 17; i++) {
    const coverPath = `/mock/verragio/brand/campaigns/${i}/cover.png`;
    const fullPath = path.join(publicDir, coverPath);

    if (fs.existsSync(fullPath)) {
      images.push({
        id: `img-cover-${i}`,
        content_type: "image",
        title: `Campaign ${i} Cover Image`,
        body: `Cover image for Verragio campaign ${i}`,
        file_path: coverPath,
        full_path: fullPath,
        category: "campaign-cover",
        associated_id: `camp-${String(i).padStart(3, '0')}`,
      });
    }

    // Check for product images too
    for (const ext of ['jpg', 'png']) {
      const productPath = `/mock/verragio/brand/campaigns/${i}/product.${ext}`;
      const productFullPath = path.join(publicDir, productPath);

      if (fs.existsSync(productFullPath)) {
        images.push({
          id: `img-product-${i}`,
          content_type: "image",
          title: `Campaign ${i} Product Image`,
          body: `Product image for Verragio campaign ${i}`,
          file_path: productPath,
          full_path: productFullPath,
          category: "product-image",
          associated_id: `camp-${String(i).padStart(3, '0')}`,
        });
        break; // Only add one product image per campaign
      }
    }
  }

  return images;
}

// ============================================
// Main Export Function
// ============================================

function main() {
  console.log('Exporting mock data to Vespa format...\n');

  const outputDir = path.join(projectRoot, 'vespa-data');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Convert all data types
  const documents = [];

  // Brands
  console.log(`Converting ${brands.length} brands...`);
  brands.forEach(brand => {
    documents.push(convertBrandToVespa(brand));
  });

  // Campaigns
  console.log(`Converting ${campaigns.length} campaigns...`);
  campaigns.forEach(campaign => {
    documents.push(convertCampaignToVespa(campaign));
  });

  // Retailers
  console.log(`Converting ${LUXURY_RETAILERS.length} retailers...`);
  LUXURY_RETAILERS.forEach((retailer, index) => {
    documents.push(convertRetailerToVespa(retailer, index));
  });

  // Resources
  console.log(`Converting ${resources.length} resources...`);
  resources.forEach(resource => {
    documents.push(convertResourceToVespa(resource));
  });

  // Write text documents
  const textDocumentsPath = path.join(outputDir, 'text-documents.json');
  fs.writeFileSync(textDocumentsPath, JSON.stringify(documents, null, 2));
  console.log(`\nWrote ${documents.length} text documents to ${textDocumentsPath}`);

  // Generate and write image manifest
  const images = generateImageManifest();
  const imagesManifestPath = path.join(outputDir, 'images-manifest.json');
  fs.writeFileSync(imagesManifestPath, JSON.stringify(images, null, 2));
  console.log(`Wrote ${images.length} image entries to ${imagesManifestPath}`);

  // Summary
  console.log('\n--- Export Summary ---');
  console.log(`Brands:    ${brands.length}`);
  console.log(`Campaigns: ${campaigns.length}`);
  console.log(`Retailers: ${LUXURY_RETAILERS.length}`);
  console.log(`Resources: ${resources.length}`);
  console.log(`Images:    ${images.length}`);
  console.log(`Total:     ${documents.length + images.length}`);
  console.log('\nExport complete!');
}

main();

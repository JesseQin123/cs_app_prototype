/**
 * Generate Extended Data for Vespa Indexing
 *
 * This script expands the base mock data to 300-500 records
 * by generating additional campaigns, products, retailers, and FAQs.
 *
 * Usage: node scripts/generate-extended-data.js
 *
 * Output: vespa-data/extended-documents.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ============================================
// Brand Data
// ============================================

const brands = [
  { id: "b-verragio", name: "Verragio" },
  { id: "b-gucci", name: "Gucci" },
  { id: "b-louisvuitton", name: "Louis Vuitton" },
  { id: "b-dior", name: "Dior" },
  { id: "b-hermes", name: "Hermès" },
  { id: "b-prada", name: "Prada" },
  { id: "b-tiffany", name: "Tiffany & Co." },
  { id: "b-cartier", name: "Cartier" },
  { id: "b-rolex", name: "Rolex" },
  { id: "b-patek", name: "Patek Philippe" },
  { id: "b-omega", name: "Omega" },
  { id: "b-burberry", name: "Burberry" },
];

// Additional luxury brands to expand the dataset
const additionalBrands = [
  { id: "b-chopard", name: "Chopard", description: "Swiss luxury watchmaker and jewelry manufacturer known for high-quality timepieces and elegant jewelry." },
  { id: "b-iwc", name: "IWC Schaffhausen", description: "Swiss luxury watch manufacturer known for pilot's watches and engineering excellence." },
  { id: "b-jaeger", name: "Jaeger-LeCoultre", description: "Swiss luxury watch and clock manufacturer known for complicated movements and elegant designs." },
  { id: "b-bvlgari", name: "Bulgari", description: "Italian luxury brand known for jewelry, watches, fragrances, and leather goods." },
  { id: "b-vancleef", name: "Van Cleef & Arpels", description: "French luxury jewelry company known for high jewelry and poetic complications." },
  { id: "b-harrywinston", name: "Harry Winston", description: "American luxury jeweler known as the King of Diamonds for exceptional gemstones." },
  { id: "b-graff", name: "Graff", description: "British luxury jewelry house known for rare and exceptional diamonds." },
  { id: "b-piaget", name: "Piaget", description: "Swiss luxury watchmaker and jeweler known for ultra-thin movements and gem-setting mastery." },
  { id: "b-davidyurman", name: "David Yurman", description: "American jewelry brand known for cable bracelet and sculptural designs." },
  { id: "b-mikimoto", name: "Mikimoto", description: "Japanese luxury jewelry company known as the creator of cultured pearls." },
  { id: "b-tacori", name: "Tacori", description: "California-based jewelry designer known for intricate engagement rings and wedding bands." },
  { id: "b-audemars", name: "Audemars Piguet", description: "Swiss high-end watch manufacturer known for Royal Oak and complex complications." },
  { id: "b-zenith", name: "Zenith", description: "Swiss luxury watchmaker known for El Primero movement and chronograph expertise." },
];

// ============================================
// Template Data for Generation
// ============================================

const campaignTypes = [
  { type: "seasonal", templates: ["Spring Collection", "Summer Essentials", "Fall Showcase", "Winter Luxury", "Holiday Season"] },
  { type: "product", templates: ["New Arrivals", "Limited Edition", "Exclusive Collection", "Signature Series", "Heritage Line"] },
  { type: "event", templates: ["Bridal Show", "VIP Preview", "Anniversary Celebration", "Launch Event", "Trunk Show"] },
  { type: "promotion", templates: ["Special Offer", "Gift Guide", "Loyalty Rewards", "Flash Sale", "Bundle Deals"] },
];

const productCategories = [
  {
    category: "engagement-ring",
    templates: [
      { name: "Solitaire Diamond Ring", desc: "Classic solitaire setting featuring a brilliant-cut center diamond" },
      { name: "Halo Engagement Ring", desc: "Stunning halo design with surrounding accent diamonds" },
      { name: "Three Stone Ring", desc: "Elegant three stone setting symbolizing past, present, and future" },
      { name: "Vintage Inspired Ring", desc: "Art deco inspired design with intricate milgrain detailing" },
      { name: "Cushion Cut Ring", desc: "Romantic cushion cut diamond in a delicate setting" },
      { name: "Oval Diamond Ring", desc: "Elongated oval diamond for a sophisticated look" },
      { name: "Princess Cut Ring", desc: "Modern princess cut diamond with clean lines" },
      { name: "Pear Shape Ring", desc: "Unique pear-shaped diamond for a distinctive style" },
    ]
  },
  {
    category: "wedding-band",
    templates: [
      { name: "Classic Gold Band", desc: "Timeless gold wedding band with comfort fit" },
      { name: "Diamond Eternity Band", desc: "Full circle of diamonds representing eternal love" },
      { name: "Platinum Wedding Ring", desc: "Durable platinum band for everyday wear" },
      { name: "Two-Tone Band", desc: "Mixed metal design combining gold and platinum" },
      { name: "Channel Set Band", desc: "Secure channel setting with brilliant diamonds" },
    ]
  },
  {
    category: "luxury-watch",
    templates: [
      { name: "Diver's Watch", desc: "Professional diving watch water resistant to 300m" },
      { name: "Chronograph", desc: "Precision chronograph with stopwatch functionality" },
      { name: "Dress Watch", desc: "Elegant slim profile perfect for formal occasions" },
      { name: "GMT Watch", desc: "Dual time zone display for the world traveler" },
      { name: "Perpetual Calendar", desc: "Complicated movement tracking date, day, month, and leap years" },
      { name: "Tourbillon", desc: "Prestigious tourbillon mechanism for ultimate precision" },
      { name: "Moon Phase", desc: "Romantic moon phase complication with artistic dial" },
    ]
  },
  {
    category: "necklace",
    templates: [
      { name: "Diamond Pendant", desc: "Delicate diamond pendant on fine chain" },
      { name: "Tennis Necklace", desc: "Classic line necklace with graduated diamonds" },
      { name: "Pearl Strand", desc: "Cultured pearl necklace with lustrous gems" },
      { name: "Layering Chains", desc: "Set of delicate chains for modern styling" },
      { name: "Statement Necklace", desc: "Bold design piece for special occasions" },
    ]
  },
  {
    category: "bracelet",
    templates: [
      { name: "Diamond Tennis Bracelet", desc: "Classic tennis bracelet with brilliant-cut diamonds" },
      { name: "Chain Link Bracelet", desc: "Bold chain links in precious metal" },
      { name: "Bangle", desc: "Solid bangle with elegant simplicity" },
      { name: "Cuff Bracelet", desc: "Statement cuff with modern design" },
      { name: "Charm Bracelet", desc: "Personalized charm bracelet for meaningful moments" },
    ]
  },
];

const faqTopics = [
  {
    topic: "ordering",
    questions: [
      { q: "How do I place an order?", a: "Orders can be placed through your authorized retailer or directly through our brand portal. Contact your account manager for assistance." },
      { q: "What is the minimum order quantity?", a: "Minimum order quantities vary by product category. Standard pieces typically require 2-3 units, while limited editions may have no minimum." },
      { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express options are available for urgent orders at additional cost." },
      { q: "Can I track my order?", a: "Yes, tracking information is provided via email once your order ships. You can also view status in the brand portal." },
    ]
  },
  {
    topic: "products",
    questions: [
      { q: "How do I authenticate products?", a: "All products include authentication certificates. Use our verification portal or scan the QR code on the certificate." },
      { q: "What materials are used?", a: "We use only the finest materials: 18K gold, platinum, ethically-sourced diamonds, and premium gemstones." },
      { q: "Are products customizable?", a: "Many products offer customization options including metal choice, stone size, and engraving. Contact your account manager for details." },
      { q: "What is the warranty policy?", a: "Products include a 2-year manufacturer warranty covering defects. Extended protection plans are available." },
    ]
  },
  {
    topic: "marketing",
    questions: [
      { q: "How do I access marketing materials?", a: "Marketing materials are available in the Resources section of your brand portal. Download high-resolution assets for print and digital use." },
      { q: "Can I customize marketing templates?", a: "Yes, templates can be customized with your store information. Use the built-in editor or download editable files." },
      { q: "What social media assets are available?", a: "We provide ready-to-post images, videos, and captions for Instagram, Facebook, and other platforms." },
      { q: "How often are marketing materials updated?", a: "New materials are released quarterly aligned with seasonal campaigns. Priority updates are pushed for new product launches." },
    ]
  },
  {
    topic: "account",
    questions: [
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. A reset link will be sent to your registered email address." },
      { q: "How do I add team members?", a: "Account administrators can add team members from Settings > Team Management. Each member receives their own login." },
      { q: "What are the different user roles?", a: "Roles include Admin (full access), Manager (order and content management), and Staff (view only with limited actions)." },
      { q: "How do I update store information?", a: "Store details can be updated in Settings > Store Profile. Changes reflect across the platform within 24 hours." },
    ]
  },
];

const additionalRetailers = [
  "Mayors Jewelers",
  "Hyde Park Jewelers",
  "Shreve & Co.",
  "Hamilton Jewelers",
  "Betteridge Jewelers",
  "Cellini Jewelers",
  "Wempe Jewelers",
  "Bucherer USA",
  "Govberg Jewelers",
  "Analog/Shift",
  "Bob's Watches",
  "Crown & Caliber",
  "Watches of Switzerland",
  "Mappin & Webb",
  "Garrard London",
  "Asprey",
  "Boodles",
  "Links of London",
  "Georg Jensen",
  "Monica Vinader",
  "Astley Clarke",
  "Mejuri",
  "Catbird",
  "Stone and Strand",
  "Vrai",
  "Brilliant Earth",
  "James Allen",
  "Blue Nile",
  "Ritani",
  "Adiamor",
  "Whiteflash",
  "Brian Gavin Diamonds",
  "Good Old Gold",
  "Victor Barbone",
  "Estate Diamond Jewelry",
  "Lang Antiques",
  "Erstwhile",
  "The RealReal Jewelry",
  "1stDibs Jewelry",
  "Ruby Lane Jewelry",
  "Bergdorf Goodman Jewelry",
  "Neiman Marcus Jewelry",
  "Saks Fifth Avenue Jewelry",
  "Nordstrom Fine Jewelry",
];

// ============================================
// Helper Functions
// ============================================

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(prefix, index) {
  return `${prefix}-${String(index).padStart(4, '0')}`;
}

// ============================================
// Generation Functions
// ============================================

function generateCampaigns(startId = 100) {
  const documents = [];
  let id = startId;

  // Generate campaigns for each brand
  [...brands, ...additionalBrands].forEach(brand => {
    const numCampaigns = randomInt(2, 5);

    for (let i = 0; i < numCampaigns; i++) {
      const typeGroup = randomChoice(campaignTypes);
      const template = randomChoice(typeGroup.templates);
      const status = randomChoice(["Active", "Active", "Active", "Draft", "Closed"]);
      const adoptionRate = status === "Draft" ? 0 : randomInt(35, 95);

      documents.push({
        fields: {
          id: generateId("camp", id++),
          content_type: "campaign",
          title: `${brand.name} ${template}`,
          body: `${template} from ${brand.name}. Explore our exclusive collection featuring the finest craftsmanship and timeless design. This ${typeGroup.type} campaign showcases our commitment to excellence.`,
          category: `campaign-${status.toLowerCase()}`,
          metadata: JSON.stringify({
            brandId: brand.id,
            brandName: brand.name,
            status: status,
            adoptionRate: adoptionRate,
            campaignType: typeGroup.type,
          }),
          image_file_name: "",
          created_at: Date.now() - randomInt(0, 90) * 24 * 60 * 60 * 1000,
        }
      });
    }
  });

  return documents;
}

function generateProducts(startId = 100) {
  const documents = [];
  let id = startId;

  // Generate products for each brand
  [...brands, ...additionalBrands].forEach(brand => {
    // Pick 2-4 random product categories for this brand
    const brandCategories = productCategories
      .sort(() => Math.random() - 0.5)
      .slice(0, randomInt(2, 4));

    brandCategories.forEach(cat => {
      const numProducts = randomInt(2, 4);
      const templates = cat.templates.sort(() => Math.random() - 0.5).slice(0, numProducts);

      templates.forEach((template, idx) => {
        const collections = ["Signature", "Heritage", "Classic", "Modern", "Artisan", "Legacy", "Premier"];
        const collection = randomChoice(collections);
        const modelNumber = `${brand.name.substring(0, 2).toUpperCase()}-${randomInt(1000, 9999)}`;
        const priceRanges = ["$1,000-3,000", "$3,000-7,000", "$7,000-15,000", "$15,000-50,000", "$50,000+"];
        const priceRange = randomChoice(priceRanges);

        documents.push({
          fields: {
            id: generateId("prod", id++),
            content_type: "product",
            title: `${brand.name} ${collection} ${template.name}`,
            body: `${template.desc}. Part of the ${brand.name} ${collection} collection. Model: ${modelNumber}. Crafted with exceptional attention to detail and the finest materials.`,
            category: cat.category,
            metadata: JSON.stringify({
              brandId: brand.id,
              brandName: brand.name,
              collection: collection,
              modelNumber: modelNumber,
              priceRange: priceRange,
              category: cat.category,
            }),
            image_file_name: "",
            created_at: Date.now() - randomInt(0, 180) * 24 * 60 * 60 * 1000,
          }
        });
      });
    });
  });

  return documents;
}

function generateRetailers(startId = 100) {
  const documents = [];
  let id = startId;

  const zones = [
    { id: "z-ne", label: "North East" },
    { id: "z-se", label: "South East" },
    { id: "z-mw", label: "Midwest" },
    { id: "z-w", label: "West Coast" },
    { id: "z-sw", label: "South West" },
    { id: "z-int", label: "International" },
  ];

  const tiers = [
    { id: "t-1", label: "T1 - Strategic Partner" },
    { id: "t-2", label: "T2 - Growth Partner" },
    { id: "t-3", label: "T3 - Authorized Retailer" },
  ];

  additionalRetailers.forEach((retailer, index) => {
    const tier = index < 10 ? tiers[0] : index < 25 ? tiers[1] : tiers[2];
    const zone = zones[index % zones.length];

    documents.push({
      fields: {
        id: generateId("retailer", id++),
        content_type: "retailer",
        title: retailer,
        body: `${retailer} is a premier luxury jewelry and watch retailer in the ${zone.label} region. As a ${tier.label}, they offer exceptional customer service and expert product knowledge.`,
        category: tier.id,
        metadata: JSON.stringify({
          tier: tier.id,
          tierLabel: tier.label,
          zone: zone.id,
          zoneLabel: zone.label,
        }),
        image_file_name: "",
        created_at: Date.now() - randomInt(0, 365) * 24 * 60 * 60 * 1000,
      }
    });
  });

  return documents;
}

function generateFAQs(startId = 100) {
  const documents = [];
  let id = startId;

  faqTopics.forEach(topic => {
    topic.questions.forEach(faq => {
      documents.push({
        fields: {
          id: generateId("faq", id++),
          content_type: "document",
          title: faq.q,
          body: faq.a,
          category: `faq-${topic.topic}`,
          metadata: JSON.stringify({
            topic: topic.topic,
            type: "faq",
          }),
          image_file_name: "",
          created_at: Date.now(),
        }
      });
    });
  });

  return documents;
}

function generateResources(startId = 100) {
  const documents = [];
  let id = startId;

  const resourceTypes = [
    { type: "guide", names: ["Setup Guide", "Quick Start", "Best Practices", "Tips & Tricks", "Troubleshooting"] },
    { type: "marketing", names: ["Social Media Kit", "Email Templates", "Print Materials", "Display Guidelines", "Photography Standards"] },
    { type: "training", names: ["Product Knowledge", "Sales Techniques", "Customer Service", "Brand Story", "Certification Program"] },
    { type: "compliance", names: ["Legal Guidelines", "Trademark Usage", "Pricing Policy", "Co-Op Program", "Quality Standards"] },
  ];

  [...brands, ...additionalBrands].slice(0, 15).forEach(brand => {
    const numResources = randomInt(2, 4);

    for (let i = 0; i < numResources; i++) {
      const typeGroup = randomChoice(resourceTypes);
      const name = randomChoice(typeGroup.names);
      const fileCount = randomInt(1, 15);

      documents.push({
        fields: {
          id: generateId("res", id++),
          content_type: "resource",
          title: `${brand.name} ${name}`,
          body: `Official ${name.toLowerCase()} for ${brand.name} retail partners. This ${typeGroup.type} resource contains ${fileCount} files to help you succeed with the brand.`,
          category: `resource-${typeGroup.type}`,
          metadata: JSON.stringify({
            brandId: brand.id,
            brandName: brand.name,
            resourceType: typeGroup.type,
            fileCount: fileCount,
          }),
          image_file_name: "",
          created_at: Date.now() - randomInt(0, 120) * 24 * 60 * 60 * 1000,
        }
      });
    }
  });

  return documents;
}

function generateBrands() {
  return additionalBrands.map(brand => ({
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
  }));
}

// ============================================
// Main Function
// ============================================

function main() {
  console.log('Generating extended data for Vespa indexing...\n');

  const outputDir = path.join(projectRoot, 'vespa-data');

  // Read existing documents
  const baseDocumentsPath = path.join(outputDir, 'text-documents.json');
  let baseDocuments = [];

  if (fs.existsSync(baseDocumentsPath)) {
    baseDocuments = JSON.parse(fs.readFileSync(baseDocumentsPath, 'utf8'));
    console.log(`Loaded ${baseDocuments.length} base documents`);
  }

  // Generate extended data
  console.log('\nGenerating new documents...');

  const newBrands = generateBrands();
  console.log(`- Additional brands: ${newBrands.length}`);

  const newCampaigns = generateCampaigns();
  console.log(`- Additional campaigns: ${newCampaigns.length}`);

  const newProducts = generateProducts();
  console.log(`- Products: ${newProducts.length}`);

  const newRetailers = generateRetailers();
  console.log(`- Additional retailers: ${newRetailers.length}`);

  const newFAQs = generateFAQs();
  console.log(`- FAQs: ${newFAQs.length}`);

  const newResources = generateResources();
  console.log(`- Additional resources: ${newResources.length}`);

  // Combine all documents
  const allDocuments = [
    ...baseDocuments,
    ...newBrands,
    ...newCampaigns,
    ...newProducts,
    ...newRetailers,
    ...newFAQs,
    ...newResources,
  ];

  // Write extended documents
  const extendedPath = path.join(outputDir, 'extended-documents.json');
  fs.writeFileSync(extendedPath, JSON.stringify(allDocuments, null, 2));

  // Summary
  console.log('\n--- Generation Summary ---');
  console.log(`Base documents:       ${baseDocuments.length}`);
  console.log(`New brands:           ${newBrands.length}`);
  console.log(`New campaigns:        ${newCampaigns.length}`);
  console.log(`New products:         ${newProducts.length}`);
  console.log(`New retailers:        ${newRetailers.length}`);
  console.log(`New FAQs:             ${newFAQs.length}`);
  console.log(`New resources:        ${newResources.length}`);
  console.log(`------------------------`);
  console.log(`Total documents:      ${allDocuments.length}`);
  console.log(`\nOutput: ${extendedPath}`);
  console.log('\nGeneration complete!');
}

main();

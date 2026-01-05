import React from 'react';
import {
  Megaphone,
  Package,
  Store,
  Sparkles,
  FolderOpen,
  HelpCircle,
  Image as ImageIcon,
} from 'lucide-react';

const CONTENT_TYPE_CONFIG = {
  campaign: {
    icon: Megaphone,
    label: 'Campaign',
    color: 'text-blue-600 bg-blue-50',
  },
  product: {
    icon: Package,
    label: 'Product',
    color: 'text-purple-600 bg-purple-50',
  },
  retailer: {
    icon: Store,
    label: 'Retailer',
    color: 'text-green-600 bg-green-50',
  },
  brand: {
    icon: Sparkles,
    label: 'Brand',
    color: 'text-amber-600 bg-amber-50',
  },
  resource: {
    icon: FolderOpen,
    label: 'Resource',
    color: 'text-orange-600 bg-orange-50',
  },
  document: {
    icon: HelpCircle,
    label: 'FAQ',
    color: 'text-teal-600 bg-teal-50',
  },
  image: {
    icon: ImageIcon,
    label: 'Image',
    color: 'text-pink-600 bg-pink-50',
  },
};

function parseMetadata(metadataStr) {
  try {
    return JSON.parse(metadataStr || '{}');
  } catch {
    return {};
  }
}

export function ResultCard({ result }) {
  const contentType = result.content_type || 'document';
  const config = CONTENT_TYPE_CONFIG[contentType] || CONTENT_TYPE_CONFIG.document;
  const Icon = config.icon;
  const metadata = parseMetadata(result.metadata);

  // Truncate body text
  const truncatedBody = result.body?.length > 150
    ? result.body.substring(0, 150) + '...'
    : result.body;

  // Format relevance score
  const relevancePercent = result.relevance
    ? Math.round(result.relevance * 100)
    : null;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 p-4
                    hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className={`p-2 rounded-lg ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Type Label */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {result.title}
            </h3>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* Metadata Pills */}
          {metadata.brandName && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded">
                {metadata.brandName}
              </span>
              {metadata.status && (
                <span className={`px-2 py-0.5 rounded ${
                  metadata.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : metadata.status === 'Draft'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {metadata.status}
                </span>
              )}
              {metadata.adoptionRate !== undefined && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                  {metadata.adoptionRate}% adoption
                </span>
              )}
            </div>
          )}

          {/* Additional metadata for products */}
          {metadata.collection && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded">
                {metadata.collection}
              </span>
              {metadata.priceRange && (
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  {metadata.priceRange}
                </span>
              )}
              {metadata.category && (
                <span className="bg-gray-100 px-2 py-0.5 rounded capitalize">
                  {metadata.category.replace(/-/g, ' ')}
                </span>
              )}
            </div>
          )}

          {/* Retailer metadata */}
          {metadata.tierLabel && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded">
                {metadata.tierLabel}
              </span>
              {metadata.zoneLabel && (
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  {metadata.zoneLabel}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {truncatedBody}
          </p>
        </div>

        {/* Relevance Score */}
        {relevancePercent !== null && (
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-gray-400">Match</div>
            <div className="text-sm font-medium text-gray-600">
              {relevancePercent}%
            </div>
          </div>
        )}
      </div>

      {/* Image Preview (if available) */}
      {result.image_file_name && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={`/uploads/${result.image_file_name}`}
              alt={result.title || 'Image'}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 hidden items-center justify-center bg-gray-100">
              <div className="text-center text-gray-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                <span className="text-xs">{result.image_file_name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultCard;

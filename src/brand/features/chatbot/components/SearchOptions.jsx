import React from 'react';
import { Type, Image, Layers } from 'lucide-react';

const RANKING_OPTIONS = [
  {
    value: 'text_search',
    label: 'Text',
    icon: Type,
    description: 'Keyword matching',
  },
  {
    value: 'image_search',
    label: 'Image',
    icon: Image,
    description: 'Visual similarity',
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
    icon: Layers,
    description: 'Combined search',
  },
];

const CONTENT_TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'campaign', label: 'Campaigns' },
  { value: 'product', label: 'Products' },
  { value: 'retailer', label: 'Retailers' },
  { value: 'brand', label: 'Brands' },
  { value: 'resource', label: 'Resources' },
  { value: 'document', label: 'FAQs' },
];

export function SearchOptions({ filters, onFiltersChange }) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
      {/* Search Mode */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-2">Mode:</span>
        <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
          {RANKING_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = filters.ranking_profile === option.value;

            return (
              <button
                key={option.value}
                onClick={() => onFiltersChange({ ranking_profile: option.value })}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                title={option.description}
              >
                <Icon className="w-3.5 h-3.5" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-2">Type:</span>
        <select
          value={filters.content_type}
          onChange={(e) => onFiltersChange({ content_type: e.target.value })}
          className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5
                     text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {CONTENT_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results Limit */}
      <div className="flex items-center gap-1 ml-auto">
        <span className="text-xs text-gray-500 mr-2">Show:</span>
        <select
          value={filters.limit}
          onChange={(e) => onFiltersChange({ limit: parseInt(e.target.value) })}
          className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5
                     text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {[10, 20, 50].map((limit) => (
            <option key={limit} value={limit}>
              {limit} results
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchOptions;

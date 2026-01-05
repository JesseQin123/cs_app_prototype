import React from 'react';
import {
  Megaphone,
  Package,
  Store,
  Sparkles,
  FolderOpen,
  HelpCircle,
  FileText,
  ExternalLink
} from 'lucide-react';

/**
 * SourceDocuments Component
 *
 * Displays the retrieved documents used as context for the AI response.
 */

const CONTENT_TYPE_CONFIG = {
  campaign: {
    icon: Megaphone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Campaign'
  },
  product: {
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    label: 'Product'
  },
  retailer: {
    icon: Store,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Retailer'
  },
  brand: {
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    label: 'Brand'
  },
  resource: {
    icon: FolderOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    label: 'Resource'
  },
  document: {
    icon: HelpCircle,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    label: 'FAQ'
  },
  default: {
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    label: 'Document'
  }
};

function SourceDocument({ doc, index }) {
  const config = CONTENT_TYPE_CONFIG[doc.content_type] || CONTENT_TYPE_CONFIG.default;
  const Icon = config.icon;

  const truncateBody = (text, maxLength = 100) => {
    if (!text) return '';
    // Remove highlight markers from Vespa
    const cleanText = text.replace(/<sep\s*\/?>/g, '').replace(/<hi>/g, '').replace(/<\/hi>/g, '');
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  const formatRelevance = (relevance) => {
    if (!relevance) return null;
    // Convert relevance score to percentage (assuming max around 20)
    const percentage = Math.min(100, Math.round((relevance / 15) * 100));
    return `${percentage}% match`;
  };

  return (
    <div className={`${config.bgColor} rounded-lg p-3 text-sm`}>
      <div className="flex items-start gap-2">
        {/* Index number */}
        <span className={`${config.color} font-medium text-xs mt-0.5`}>
          [{index + 1}]
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            <span className={`${config.color} text-xs font-medium`}>
              {config.label}
            </span>
            {doc.relevance && (
              <span className="text-gray-400 text-xs">
                {formatRelevance(doc.relevance)}
              </span>
            )}
          </div>

          <h4 className="font-medium text-gray-800 truncate">
            {doc.title || 'Untitled'}
          </h4>

          {doc.body && (
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">
              {truncateBody(doc.body)}
            </p>
          )}

          {doc.url && (
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              View source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SourceDocuments({ documents }) {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 w-full">
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Sources Used
        </h5>
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <SourceDocument key={doc.id || index} doc={doc} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SourceDocuments;

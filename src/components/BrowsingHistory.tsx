// FILE PATH: src/components/BrowsingHistory.tsx
// Component for displaying recent searches and viewed properties for non-signed-in users

import React from 'react';
import { Clock, Eye, Search, X, TrendingUp, MapPin } from 'lucide-react';
import { useBrowsingHistory } from '../hooks/useBrowsingHistory';
import { formatCurrency } from '../lib/utils';

interface BrowsingHistoryProps {
  className?: string;
}

export const BrowsingHistory: React.FC<BrowsingHistoryProps> = ({ className = '' }) => {
  const {
    recentSearches,
    viewedProperties,
    clearRecentSearches,
    clearViewedProperties,
    clearAllHistory,
  } = useBrowsingHistory();

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleSearchClick = (query: string) => {
    // Dispatch search event or navigate to search results
    window.dispatchEvent(new CustomEvent('browse-search', { detail: query }));
  };

  const handlePropertyClick = (propertyId: string) => {
    window.dispatchEvent(new CustomEvent('browse-property', { detail: propertyId }));
  };

  if (recentSearches.length === 0 && viewedProperties.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Search size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 mb-2">Start browsing to see your history</p>
        <p className="text-sm text-gray-400">
          Your recent searches and viewed properties will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Recent Searches</h3>
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X size={14} />
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {recentSearches.slice(0, 5).map((search) => (
              <button
                key={`${search.query}-${search.timestamp}`}
                onClick={() => handleSearchClick(search.query)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-3 group"
              >
                <Search size={16} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{search.query}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatTimeAgo(search.timestamp)}</span>
                    {search.resultCount && (
                      <>
                        <span>•</span>
                        <span>{search.resultCount} properties</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Viewed Properties */}
      {viewedProperties.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-green-600" />
              <h3 className="font-semibold text-gray-900">Recently Viewed</h3>
            </div>
            <button
              onClick={clearViewedProperties}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X size={14} />
              Clear
            </button>
          </div>
          <div className="space-y-3">
            {viewedProperties.slice(0, 4).map((property) => (
              <button
                key={`${property.id}-${property.timestamp}`}
                onClick={() => handlePropertyClick(property.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition group"
              >
                <div className="flex gap-3">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm line-clamp-2 group-hover:text-blue-600">
                      {property.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-blue-600 font-bold text-sm">
                        {formatCurrency(property.price)}
                        {property.listingType === 'rent' && '/mo'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        property.listingType === 'rent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {property.listingType === 'rent' ? 'Rent' : 'Sale'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(property.timestamp)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear All */}
      {(recentSearches.length > 0 || viewedProperties.length > 0) && (
        <div className="pt-4 border-t">
          <button
            onClick={clearAllHistory}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            Clear all browsing history
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowsingHistory;

// Property Listings page that composes the Property Search system
import React, { useEffect, useState } from 'react';
import { Sliders as SlidersHorizontal } from 'lucide-react';
import { SearchResults } from '../modules/properties/components/PropertySearch/SearchResults';
import { SearchBar } from '../modules/properties/components/PropertySearch/SearchBar';
import { PropertyGrid } from '../modules/properties/components/PropertyGrid';
import { usePropertySearch } from '../modules/properties/hooks/usePropertySearch';
import { propertyService } from '../modules/properties/services/propertyService';
import type { Property } from '../modules/properties/types/property.types';

export const PropertyListings: React.FC = () => {
  const { filters, updateFilters, performSearch } = usePropertySearch();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // initial search
    performSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const props = await propertyService.getFeaturedProperties(8);
        setFeatured(props);
      } catch (e) {
        console.error('Failed to load featured properties', e);
      } finally {
        setLoadingFeatured(false);
      }
    };
    loadFeatured();
  }, []);

  const setListingType = (type?: 'rent' | 'sale' | 'sold') => {
    // 'sold' can map to status filter
    if (type === 'sold') {
      updateFilters({ listingType: undefined, status: ['sold'] as any, page: 1 });
    } else {
      updateFilters({ listingType: type, status: undefined, page: 1 });
    }
    performSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with Search */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h1 className="text-5xl font-bold mb-4 text-center">Find Your Perfect Home</h1>
          <p className="text-xl text-center mb-8 text-white/90">Smart filters. Beautiful results.</p>
          <div className="max-w-4xl mx-auto">
            <SearchBar className="bg-white rounded-2xl shadow-2xl p-0" />
          </div>
        </div>
      </div>

      {/* Quick Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setListingType('rent')}
                className={`px-4 py-2 rounded-lg font-semibold ${filters.listingType === 'rent' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Rent
              </button>
              <button
                onClick={() => setListingType('sale')}
                className={`px-4 py-2 rounded-lg font-semibold ${filters.listingType === 'sale' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Buy
              </button>
              <button
                onClick={() => setListingType('sold')}
                className={`px-4 py-2 rounded-lg font-semibold ${(filters as any).status?.includes('sold') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Sold
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Featured */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
          {/* could link to all featured */}
        </div>
        <PropertyGrid properties={featured} loading={loadingFeatured} columns={4} />
      </div>

      {/* Search Results */}
      <SearchResults />
    </div>
  );
};

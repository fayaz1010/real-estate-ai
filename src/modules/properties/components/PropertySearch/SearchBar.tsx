// FILE PATH: src/modules/properties/components/PropertySearch/SearchBar.tsx
// Module 1.2: Property Listings Management - Main Search Bar Component

import { useJsApiLoader } from "@react-google-maps/api";
import { Search, MapPin, X, TrendingUp } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

import { usePropertySearch } from "../../hooks/usePropertySearch";
import { searchService } from "../../services/searchService";

import { useBrowsingHistory } from "@/hooks/useBrowsingHistory";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search by suburb, postcode, city or address...",
  autoFocus = false,
  onSearch,
  showSuggestions = true,
  className = "",
}) => {
  const { updateFilters, performSearch } = usePropertySearch();
  const { saveRecentSearch } = useBrowsingHistory();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [placeSuggestions, setPlaceSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Initialize autocomplete service
  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  // Popular searches
  const popularSearches = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Downtown",
    "Beach Properties",
    "Pet Friendly",
  ];

  // Fetch suggestions as user types using Google Places Autocomplete
  useEffect(() => {
    if (!query || !showSuggestions) {
      setSuggestions([]);
      setPlaceSuggestions([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);

      // Try Google Places Autocomplete first
      if (isLoaded && autocompleteService.current) {
        try {
          autocompleteService.current.getPlacePredictions(
            {
              input: query,
              types: ["(regions)"], // Focus on cities, suburbs, postcodes
              componentRestrictions: { country: "us" }, // Change to your country
            },
            (predictions, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                setPlaceSuggestions(predictions);
              } else {
                setPlaceSuggestions([]);
              }
              setIsLoading(false);
            },
          );
        } catch (error) {
          console.error("Failed to fetch place suggestions:", error);
          setPlaceSuggestions([]);
          setIsLoading(false);
        }
      } else {
        // Fallback to backend search
        try {
          const results = await searchService.getLocationSuggestions(query);
          setSuggestions(results);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, showSuggestions, isLoaded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    // Save to browsing history
    saveRecentSearch(searchQuery);

    updateFilters({ location: searchQuery, keywords: searchQuery, page: 1 });
    performSearch();
    setShowDropdown(false);

    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    updateFilters({ keywords: undefined, location: undefined });
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={20} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          disabled={!query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          Search
        </button>
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Google Places Suggestions */}
              {placeSuggestions.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Locations
                  </div>
                  {placeSuggestions.map((prediction) => (
                    <button
                      key={prediction.place_id}
                      onClick={() =>
                        handleSuggestionClick(prediction.description)
                      }
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3"
                    >
                      <MapPin
                        size={16}
                        className="text-blue-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-900 block">
                          {prediction.structured_formatting.main_text}
                        </span>
                        <span className="text-xs text-gray-500">
                          {prediction.structured_formatting.secondary_text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Fallback Suggestions */}
              {suggestions.length > 0 && placeSuggestions.length === 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3"
                    >
                      <MapPin
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="text-gray-900">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              {!query && (
                <div className="py-2 border-t">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                    <TrendingUp size={12} />
                    Popular Searches
                  </div>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center gap-3"
                    >
                      <Search
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query &&
                !isLoading &&
                suggestions.length === 0 &&
                placeSuggestions.length === 0 && (
                  <div className="p-8 text-center">
                    <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600 mb-2">No locations found</p>
                    <p className="text-sm text-gray-500">
                      Try searching for a suburb, city, postcode or address
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

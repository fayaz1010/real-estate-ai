# Module 1.2: Property Listings Management - Architecture Plan

## 🎯 Goal: Market-Leading Property Listings Platform

Build a comprehensive property listing system that **surpasses Zillow and Realestate.com** with:
- Individual property pages with rich detail
- Advanced search and filtering
- Interactive maps with clustering
- High-quality image galleries with virtual tours
- Neighborhood insights and analytics
- 3D floor plans support
- Saved searches and favorites
- Property comparison tools
- Price history and market trends

---

## 📁 Directory Structure

```
src/modules/properties/
├── types/
│   └── property.types.ts          # Property type definitions
├── utils/
│   ├── propertyValidation.ts      # Property data validation
│   ├── priceCalculator.ts         # Price/mortgage calculations
│   ├── searchFilters.ts           # Search filtering logic
│   └── mapHelpers.ts              # Map utilities
├── services/
│   ├── propertyService.ts         # Property CRUD API
│   ├── imageService.ts            # Image upload/management
│   └── searchService.ts           # Search API
├── store/
│   ├── propertySlice.ts           # Property state management
│   └── searchSlice.ts             # Search state management
├── hooks/
│   ├── useProperties.ts           # Property operations hook
│   ├── usePropertySearch.ts       # Search functionality hook
│   ├── usePropertyForm.ts         # Property form management
│   ├── useFavorites.ts            # Favorites management
│   └── usePropertyComparison.ts   # Compare properties
├── components/
│   ├── PropertyCard.tsx           # Property card (list view)
│   ├── PropertyGrid.tsx           # Grid of properties
│   ├── PropertyList.tsx           # List view of properties
│   ├── PropertyDetails/           # Individual property page
│   │   ├── PropertyDetailsPage.tsx    # Main property page
│   │   ├── PropertyHero.tsx           # Hero section with images
│   │   ├── PropertyOverview.tsx       # Key details overview
│   │   ├── PropertyDescription.tsx    # Full description
│   │   ├── PropertyFeatures.tsx       # Features & amenities
│   │   ├── PropertyLocation.tsx       # Map & neighborhood
│   │   ├── PropertyPricing.tsx        # Price & mortgage calc
│   │   ├── PropertyGallery.tsx        # Image lightbox gallery
│   │   ├── PropertyTour.tsx           # Virtual tour section
│   │   ├── PropertyContact.tsx        # Contact landlord/agent
│   │   ├── SimilarProperties.tsx      # Similar listings
│   │   └── PropertyHistory.tsx        # Price history chart
│   ├── PropertyForm/              # Create/Edit property
│   │   ├── PropertyFormWizard.tsx     # Multi-step form
│   │   ├── BasicDetailsStep.tsx       # Step 1: Basic info
│   │   ├── LocationStep.tsx           # Step 2: Location
│   │   ├── PricingStep.tsx            # Step 3: Pricing
│   │   ├── FeaturesStep.tsx           # Step 4: Features
│   │   ├── ImagesStep.tsx             # Step 5: Photos
│   │   └── ReviewStep.tsx             # Step 6: Review
│   ├── PropertySearch/            # Search components
│   │   ├── SearchBar.tsx              # Main search input
│   │   ├── SearchFilters.tsx          # Filter sidebar
│   │   ├── SearchResults.tsx          # Results display
│   │   ├── SearchMap.tsx              # Map view with pins
│   │   ├── SavedSearches.tsx          # Saved search management
│   │   └── SearchSortOptions.tsx      # Sort controls
│   ├── PropertyMap/               # Map components
│   │   ├── PropertyMapView.tsx        # Full map view
│   │   ├── PropertyMapMarker.tsx      # Custom marker
│   │   ├── MapCluster.tsx             # Marker clustering
│   │   └── MapControls.tsx            # Map controls
│   ├── ImageUploader/             # Image management
│   │   ├── ImageUploader.tsx          # Upload component
│   │   ├── ImageGallery.tsx           # Gallery view
│   │   ├── ImageEditor.tsx            # Crop/edit images
│   │   └── DragDropZone.tsx           # Drag & drop upload
│   ├── PropertyComparison/        # Compare properties
│   │   ├── ComparisonTable.tsx        # Side-by-side table
│   │   └── CompareButton.tsx          # Add to compare
│   ├── SavedProperties/           # Favorites
│   │   ├── FavoriteButton.tsx         # Heart button
│   │   └── SavedPropertiesList.tsx    # Saved list
│   └── Shared/                    # Shared components
│       ├── PropertyStatus.tsx         # Status badge
│       ├── PropertyPrice.tsx          # Price display
│       ├── PropertyBadges.tsx         # Feature badges
│       └── ShareButton.tsx            # Share property
```

---

## 🗂️ Type Definitions

### Core Property Types

```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  
  // Location
  address: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  
  // Pricing
  price: number;
  priceType: 'monthly' | 'total'; // rent or sale
  listingType: 'rent' | 'sale';
  deposit?: number;
  
  // Property details
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  
  // Features
  features: string[];
  amenities: string[];
  petPolicy: 'allowed' | 'not_allowed' | 'negotiable';
  parking: number;
  furnished: boolean;
  
  // Media
  images: PropertyImage[];
  videos?: string[];
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  
  // Status
  status: 'available' | 'pending' | 'rented' | 'sold' | 'off_market';
  availableFrom?: string;
  
  // Owner/Agent
  ownerId: string;
  ownerType: 'landlord' | 'agent' | 'property_manager';
  agentInfo?: AgentInfo;
  
  // Metadata
  views: number;
  favorites: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface PropertyImage {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
}

interface AgentInfo {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  licenseNumber?: string;
}

interface SearchFilters {
  location?: string;
  listingType?: 'rent' | 'sale';
  propertyType?: string[];
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqftMin?: number;
  sqftMax?: number;
  features?: string[];
  petFriendly?: boolean;
  availableFrom?: string;
  bounds?: MapBounds; // for map search
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
```

---

## 🎨 Key Features for Each Property Page

### 1. **Hero Section** (PropertyHero.tsx)
- Full-width image carousel
- Primary image with thumbnails
- 360° virtual tour button
- Video tour button
- Share button (social media)
- Favorite/Save button
- Contact landlord button (sticky)
- Property status badge
- Image count indicator

### 2. **Overview Section** (PropertyOverview.tsx)
- **Price** - Large, prominent display with price history
- **Address** - Full address with map pin icon
- **Key Stats** - Bedrooms, bathrooms, sqft in icon cards
- **Property Type** - Apartment, house, etc.
- **Available Date** - When property is available
- **Last Updated** - Freshness indicator

### 3. **Description Section** (PropertyDescription.tsx)
- Full property description (expandable if long)
- Highlights/key features in bullet points
- "Show more/less" toggle for long descriptions

### 4. **Features & Amenities** (PropertyFeatures.tsx)
- **Interior Features** - Hardwood floors, granite counters, etc.
- **Appliances** - Washer/dryer, dishwasher, etc.
- **Building Amenities** - Gym, pool, parking, etc.
- **Outdoor Space** - Balcony, yard, patio
- **Utilities Included** - Water, gas, electric, internet
- **Pet Policy** - Visual pet-friendly indicator
- **Parking** - Number of spaces, type (garage/street)

### 5. **Location & Neighborhood** (PropertyLocation.tsx)
- **Interactive Map** - Full-screen capable, street view
- **Neighborhood Info**:
  - Walk Score / Transit Score / Bike Score
  - Nearby schools with ratings
  - Restaurants & cafes (with distance)
  - Grocery stores & shopping
  - Parks & recreation
  - Public transportation
  - Crime statistics
  - Average commute times
- **Points of Interest** - Pins on map

### 6. **Pricing & Mortgage Calculator** (PropertyPricing.tsx)
- **Rent Details** (if rental):
  - Monthly rent
  - Security deposit
  - Application fee
  - Pet deposit
  - Utilities (included/not included)
  
- **Purchase Details** (if sale):
  - List price
  - Price per sqft
  - Mortgage calculator with inputs:
    - Down payment
    - Interest rate
    - Loan term
    - Property tax
    - HOA fees
  - Monthly payment breakdown chart
  
- **Price History Chart** - Historical pricing data

### 7. **Image Gallery** (PropertyGallery.tsx)
- Lightbox viewer with keyboard navigation
- Image categories (Living Room, Kitchen, Bedroom, etc.)
- Zoom functionality
- Download original image
- Slideshow mode
- Thumbnail strip

### 8. **Virtual Tour** (PropertyTour.tsx)
- Embedded 3D tour (Matterport style)
- 360° panoramic images
- Video walkthrough
- Floor plan with clickable rooms

### 9. **Contact Section** (PropertyContact.tsx)
- **Landlord/Agent Card**:
  - Photo, name, rating
  - License number (for agents)
  - Response time indicator
  - Number of listings
  
- **Contact Form**:
  - Name, email, phone
  - Message textarea
  - Schedule viewing button
  - Request info button
  
- **Quick Actions**:
  - Call button (phone)
  - Email button
  - SMS button
  - Schedule tour

### 10. **Similar Properties** (SimilarProperties.tsx)
- 4-6 similar listings
- Based on location, price, size
- Horizontal scrollable carousel

### 11. **Additional Sections**
- **Property History** - Price changes, days on market
- **Schools Nearby** - Ratings, distance, type
- **Transportation** - Bus stops, metro stations
- **Neighborhood Stats** - Demographics, income levels
- **Reviews** (if applicable) - Tenant reviews for building

---

## 🗺️ Map Features

### PropertyMapView.tsx
- **Map Providers**: Google Maps or Mapbox
- **Marker Clustering** - Groups nearby properties
- **Custom Markers** - Price on marker, color-coded by type
- **Hover Cards** - Quick preview on marker hover
- **Draw Search Area** - Draw polygon to search
- **Filters on Map** - Apply filters without leaving map
- **Street View** - Google Street View integration
- **Satellite View** - Toggle map types
- **Heat Map** - Price heat map overlay

---

## 🔍 Search Features

### Advanced Search & Filters
- **Location**: City, neighborhood, zip code, address
- **Price Range**: Min/max with slider
- **Property Type**: Multi-select (apartment, house, etc.)
- **Bedrooms/Bathrooms**: Dropdowns or buttons
- **Square Footage**: Min/max range
- **Keywords**: Free text search
- **Features**: Checkboxes for all amenities
- **Move-in Date**: Calendar picker
- **Pet Policy**: Pet-friendly filter
- **Parking**: Number of spaces required
- **Furnished**: Toggle
- **Listing Type**: Rent or Sale
- **Open House**: Properties with scheduled tours

### Search Results
- **View Options**:
  - Grid view (default)
  - List view (detailed)
  - Map view (with pins)
  
- **Sort Options**:
  - Price (low to high, high to low)
  - Newest listings
  - Recently updated
  - Most relevant
  - Square footage
  - Bedrooms/Bathrooms
  
- **Pagination**: Load more or numbered pages
- **Results Count**: "Showing X of Y properties"
- **Save Search**: Save filters for alerts

---

## 📸 Image Management

### Upload Features
- Drag & drop multiple images
- Progress indicator for each upload
- Image preview before upload
- Reorder images (drag & drop)
- Set primary image
- Add captions to images
- Bulk delete
- Image optimization (automatic resize/compress)
- Format support: JPG, PNG, WebP
- Max file size validation
- Image quality selector

---

## 💾 Data Structure Highlights

### Performance Optimization
- **Image CDN**: Store images on CDN (CloudFlare R2 / AWS S3)
- **Lazy Loading**: Images load as user scrolls
- **Caching**: Cache property details in Redux
- **Pagination**: Load 20-50 properties at a time
- **Debounced Search**: Reduce API calls on typing
- **Map Bounds**: Only load properties in visible map area

---

## 🎯 API Endpoints Needed

```
# Property CRUD
GET    /api/properties                    # List all properties
GET    /api/properties/:id                # Get property details
POST   /api/properties                    # Create property
PATCH  /api/properties/:id                # Update property
DELETE /api/properties/:id                # Delete property
POST   /api/properties/:id/publish        # Publish property
POST   /api/properties/:id/unpublish      # Unpublish property

# Search
GET    /api/properties/search             # Search with filters
POST   /api/properties/search/save        # Save search
GET    /api/properties/search/saved       # Get saved searches

# Images
POST   /api/properties/:id/images         # Upload images
DELETE /api/properties/:id/images/:imageId # Delete image
PATCH  /api/properties/:id/images/:imageId # Update image order

# Favorites
POST   /api/properties/:id/favorite       # Add to favorites
DELETE /api/properties/:id/favorite       # Remove from favorites
GET    /api/properties/favorites          # Get user favorites

# Analytics
POST   /api/properties/:id/view           # Track view
GET    /api/properties/:id/analytics      # Get property stats

# Comparison
POST   /api/properties/compare            # Compare properties
Body: { propertyIds: string[] }

# Neighborhood Data
GET    /api/neighborhoods/:zipCode        # Get neighborhood info
GET    /api/schools/nearby                # Get nearby schools
GET    /api/transit/nearby                # Get transit options
```

---

## 🔥 Competitive Advantages

**vs Zillow/Realestate.com:**
1. ✅ **Cleaner UI** - Modern, uncluttered design
2. ✅ **Faster Load Times** - Optimized images, lazy loading
3. ✅ **Better Mobile Experience** - Touch-optimized
4. ✅ **Real-time Updates** - WebSocket for new listings
5. ✅ **Advanced Filters** - More granular search options
6. ✅ **3D Tours Integration** - Better virtual tour support
7. ✅ **AI-Powered Recommendations** - Smart similar properties
8. ✅ **Integrated Management** - Seamless transition to post-deal
9. ✅ **Better Agent Tools** - Enhanced dashboard for agents
10. ✅ **Transparency** - Clear pricing, no hidden fees

---

## 📦 Files to Create (35 files)

I'll build them in this order:

**Phase 1: Foundation (Files 1-8)**
1. property.types.ts
2. propertyValidation.ts
3. priceCalculator.ts
4. searchFilters.ts
5. mapHelpers.ts
6. propertyService.ts
7. imageService.ts
8. searchService.ts

**Phase 2: State Management (Files 9-10)**
9. propertySlice.ts
10. searchSlice.ts

**Phase 3: Hooks (Files 11-15)**
11. useProperties.ts
12. usePropertySearch.ts
13. usePropertyForm.ts
14. useFavorites.ts
15. usePropertyComparison.ts

**Phase 4: Core Components (Files 16-20)**
16. PropertyCard.tsx
17. PropertyGrid.tsx
18. PropertyList.tsx
19. PropertyStatus.tsx (shared)
20. PropertyPrice.tsx (shared)

**Phase 5: Property Details Page (Files 21-30)**
21. PropertyDetailsPage.tsx
22. PropertyHero.tsx
23. PropertyOverview.tsx
24. PropertyDescription.tsx
25. PropertyFeatures.tsx
26. PropertyLocation.tsx
27. PropertyPricing.tsx
28. PropertyGallery.tsx
29. PropertyContact.tsx
30. SimilarProperties.tsx

**Phase 6: Search & Upload (Files 31-35)**
31. SearchBar.tsx
32. SearchFilters.tsx
33. SearchResults.tsx
34. ImageUploader.tsx
35. FavoriteButton.tsx

---

Ready to start building? Let's create each file with production-quality code!
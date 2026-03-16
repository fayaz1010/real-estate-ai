<#
.SYNOPSIS
    Creates the directory and file structure for the Real Estate Platform
.DESCRIPTION
    This script sets up the complete folder and file structure for the Real Estate Platform,
    including modules for authentication, property listings, applications, documents, and more.
.NOTES
    Version: 1.0
    Author: Your Name
    Date: $(Get-Date -Format "yyyy-MM-dd")
#>

# Set Error Action Preference
$ErrorActionPreference = "Stop"

# Function to create directories
function New-DirectoryStructure {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string[]]$Paths,
        [string]$Description = ""
    )
    
    if ($Description) {
        Write-Host "[DIR] $Description" -ForegroundColor Cyan
    }
    
    foreach ($path in $Paths) {
        try {
            $null = New-Item -ItemType Directory -Path $path -Force -ErrorAction Stop
            Write-Host "  [OK] Created: $path" -ForegroundColor Green
        }
        catch {
            Write-Warning "[ERROR] Failed to create directory: $path"
            Write-Warning $_.Exception.Message
        }
    }
}

# Function to create files
function New-FileStructure {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string[]]$Files,
        [string]$Description = ""
    )
    
    if ($Description) {
        Write-Host "[FILE] $Description" -ForegroundColor Cyan
    }
    
    foreach ($file in $Files) {
        try {
            $dir = Split-Path -Path $file -Parent
            if (-not (Test-Path -Path $dir)) {
                $null = New-Item -ItemType Directory -Path $dir -Force -ErrorAction Stop
            }
            $null = New-Item -ItemType File -Path $file -Force -ErrorAction Stop
            Write-Host "  [OK] Created: $file" -ForegroundColor Green
        }
        catch {
            Write-Warning "[ERROR] Failed to create file: $file"
            Write-Warning $_.Exception.Message
        }
    }
}

# Function to create a module section
function Write-ModuleHeader {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Title,
        [string]$Description = ""
    )
    
    Write-Host "`n" + ("=" * 80)
    Write-Host $Title -ForegroundColor Yellow
    if ($Description) {
        Write-Host $Description -ForegroundColor DarkGray
    }
    Write-Host ("=" * 80) + "`n"
}

# Main Script
Write-Host "`n[START] Starting Real Estate Platform Structure Creation..." -ForegroundColor Cyan
Write-Host ("-" * 80) + "`n"

# ==========================================
# BASE DIRECTORIES
# ==========================================
Write-ModuleHeader -Title "CREATING BASE DIRECTORIES" -Description "Setting up the main directory structure..."

$baseDirs = @(
    "src/modules",
    "src/store",
    "src/services",
    "src/config",
    "src/utils",
    "src/types",
    "src/hooks",
    "src/components"
)

New-DirectoryStructure -Paths $baseDirs -Description "Creating base directories..."

# ==========================================
# MODULE 1: FOUNDATION (PRE-DEAL)
# ==========================================
Write-ModuleHeader -Title "MODULE 1: FOUNDATION (PRE-DEAL)" -Description "Setting up core functionality modules..."

# Module 1.1: Authentication
Write-Host "[AUTH] MODULE 1.1: AUTHENTICATION" -ForegroundColor Yellow

$authDirs = @(
    "src/modules/auth/components",
    "src/modules/auth/hooks",
    "src/modules/auth/services",
    "src/modules/auth/store",
    "src/modules/auth/types",
    "src/modules/auth/utils"
)

$authFiles = @(
    "src/modules/auth/types/auth.types.ts",
    "src/modules/auth/utils/rolePermissions.ts",
    "src/modules/auth/utils/tokenManager.ts",
    "src/modules/auth/utils/validation.ts",
    "src/modules/auth/services/authService.ts",
    "src/modules/auth/services/userService.ts",
    "src/modules/auth/store/authSlice.ts",
    "src/modules/auth/hooks/useAuth.ts",
    "src/modules/auth/hooks/useProfile.ts",
    "src/modules/auth/hooks/usePermissions.ts",
    "src/modules/auth/components/LoginForm.tsx",
    "src/modules/auth/components/RegisterForm.tsx",
    "src/modules/auth/components/ForgotPassword.tsx",
    "src/modules/auth/components/RoleSelector.tsx",
    "src/modules/auth/components/ProfileSetup.tsx"
)

New-DirectoryStructure -Paths $authDirs -Description "Creating authentication module directories..."
New-FileStructure -Files $authFiles -Description "Creating authentication module files..."

# Module 1.2: Property Listings
Write-Host "`n[PROPERTY] MODULE 1.2: PROPERTY LISTINGS" -ForegroundColor Yellow

$propertyDirs = @(
    "src/modules/properties/components/PropertyDetails",
    "src/modules/properties/components/PropertySearch",
    "src/modules/properties/components/ImageUploader",
    "src/modules/properties/components/shared",
    "src/modules/properties/hooks",
    "src/modules/properties/services",
    "src/modules/properties/store",
    "src/modules/properties/types",
    "src/modules/properties/utils"
)

$propertyFiles = @(
    "src/modules/properties/types/property.types.ts",
    "src/modules/properties/utils/propertyValidation.ts",
    "src/modules/properties/utils/priceCalculator.ts",
    "src/modules/properties/utils/searchFilters.ts",
    "src/modules/properties/utils/mapHelpers.ts",
    "src/modules/properties/services/propertyService.ts",
    "src/modules/properties/services/imageService.ts",
    "src/modules/properties/services/searchService.ts",
    "src/modules/properties/store/propertySlice.ts",
    "src/modules/properties/store/searchSlice.ts",
    "src/modules/properties/hooks/useProperties.ts",
    "src/modules/properties/hooks/usePropertySearch.ts",
    "src/modules/properties/hooks/usePropertyForm.ts",
    "src/modules/properties/hooks/useFavorites.ts",
    "src/modules/properties/hooks/usePropertyComparison.ts",
    "src/modules/properties/components/PropertyCard.tsx",
    "src/modules/properties/components/PropertyGrid.tsx",
    "src/modules/properties/components/PropertyList.tsx",
    "src/modules/properties/components/shared/PropertyStatus.tsx",
    "src/modules/properties/components/shared/PropertyPrice.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyDetailsPage.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyHero.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyOverview.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyDescription.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyFeatures.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyLocation.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyPricing.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyGallery.tsx",
    "src/modules/properties/components/PropertyDetails/PropertyContact.tsx",
    "src/modules/properties/components/PropertyDetails/SimilarProperties.tsx",
    "src/modules/properties/components/PropertySearch/SearchBar.tsx",
    "src/modules/properties/components/PropertySearch/SearchFilters.tsx",
    "src/modules/properties/components/PropertySearch/SearchResults.tsx",
    "src/modules/properties/components/ImageUploader/ImageUploader.tsx",
    "src/modules/properties/components/ImageUploader/FavoriteButton.tsx"
)

New-DirectoryStructure -Paths $propertyDirs -Description "Creating property listings module directories..."
New-FileStructure -Files $propertyFiles -Description "Creating property listings module files..."

# ==========================================
# COMPLETION
# ==========================================
Write-Host "`n[SUCCESS] Structure creation completed!" -ForegroundColor Green
Write-Host "Total directories created: $(($baseDirs + $authDirs + $propertyDirs).Count)" -ForegroundColor Cyan
Write-Host "Total files created: $(($authFiles + $propertyFiles).Count)" -ForegroundColor Cyan

# Add more modules as needed following the same pattern
# [Previous content continues with the same pattern for other modules]

Write-Host "`n[DONE] Real Estate Platform structure is ready!" -ForegroundColor Green

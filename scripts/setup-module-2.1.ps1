# Generate Module 2.1 Structure
$baseDir = "src\modules\applications"

Write-Host "Creating Module 2.1 structure..." -ForegroundColor Cyan

# Create directories
$dirs = @(
    "types", "utils", "services", "store", "hooks",
    "components\ApplicationWizard",
    "components\ApplicationReview",
    "components\Verification",
    "components\CoApplicants",
    "components\Shared"
)

foreach ($dir in $dirs) {
    $path = Join-Path $baseDir $dir
    New-Item -ItemType Directory -Force -Path $path | Out-Null
    Write-Host "  Created: $path" -ForegroundColor Green
}

# Create placeholder files
$files = @(
    # Types
    "types\application.types.ts",
    
    # Utils
    "utils\applicationValidation.ts",
    "utils\scoringAlgorithm.ts",
    "utils\documentParser.ts",
    "utils\autoFillHelper.ts",
    
    # Services
    "services\applicationService.ts",
    "services\verificationService.ts",
    "services\backgroundCheckService.ts",
    "services\creditCheckService.ts",
    
    # Store
    "store\applicationSlice.ts",
    "store\verificationSlice.ts",
    
    # Hooks
    "hooks\useApplication.ts",
    "hooks\useApplicationForm.ts",
    "hooks\useVerification.ts",
    "hooks\useApplicationReview.ts",
    
    # Wizard
    "components\ApplicationWizard\ApplicationWizard.tsx",
    "components\ApplicationWizard\PersonalInfoStep.tsx",
    "components\ApplicationWizard\EmploymentStep.tsx",
    "components\ApplicationWizard\IncomeVerificationStep.tsx",
    "components\ApplicationWizard\RentalHistoryStep.tsx",
    "components\ApplicationWizard\ReferencesStep.tsx",
    "components\ApplicationWizard\BackgroundConsentStep.tsx",
    "components\ApplicationWizard\DocumentUploadStep.tsx",
    "components\ApplicationWizard\ReviewSubmitStep.tsx",
    
    # Review
    "components\ApplicationReview\ApplicationsList.tsx",
    "components\ApplicationReview\ApplicationCard.tsx",
    "components\ApplicationReview\ApplicationDetails.tsx",
    "components\ApplicationReview\ApplicationTimeline.tsx",
    "components\ApplicationReview\ApprovalWorkflow.tsx",
    "components\ApplicationReview\ScoringBreakdown.tsx",
    "components\ApplicationReview\CompareApplications.tsx",
    
    # Verification
    "components\Verification\IdentityVerification.tsx",
    "components\Verification\IncomeVerification.tsx",
    "components\Verification\EmploymentVerification.tsx",
    "components\Verification\CreditReport.tsx",
    "components\Verification\BackgroundCheck.tsx",
    "components\Verification\VerificationBadge.tsx",
    
    # CoApplicants
    "components\CoApplicants\CoApplicantInvite.tsx",
    "components\CoApplicants\CoApplicantForm.tsx",
    "components\CoApplicants\CoApplicantProgress.tsx",
    
    # Shared
    "components\Shared\ApplicationStatus.tsx",
    "components\Shared\DocumentViewer.tsx",
    "components\Shared\ScoreIndicator.tsx"
)

$template = "// PLACEHOLDER FILE: {0}`n// TODO: Add your implementation here`n"

foreach ($file in $files) {
    $fullPath = Join-Path $baseDir $file
    $content = $template -f $file
    Set-Content -Path $fullPath -Value $content -Encoding UTF8
    Write-Host "  Created: $file" -ForegroundColor Gray
}

# Create index files
$indexFiles = @{
    "components\ApplicationWizard\index.ts" = "export * from './ApplicationWizard';`nexport * from './PersonalInfoStep';`nexport * from './EmploymentStep';`nexport * from './IncomeVerificationStep';`nexport * from './RentalHistoryStep';`nexport * from './ReferencesStep';`nexport * from './BackgroundConsentStep';`nexport * from './DocumentUploadStep';`nexport * from './ReviewSubmitStep';"
    "components\ApplicationReview\index.ts" = "export * from './ApplicationsList';`nexport * from './ApplicationCard';`nexport * from './ApplicationDetails';`nexport * from './ApplicationTimeline';`nexport * from './ApprovalWorkflow';`nexport * from './ScoringBreakdown';`nexport * from './CompareApplications';"
    "components\Verification\index.ts" = "export * from './IdentityVerification';`nexport * from './IncomeVerification';`nexport * from './EmploymentVerification';`nexport * from './CreditReport';`nexport * from './BackgroundCheck';`nexport * from './VerificationBadge';"
    "components\CoApplicants\index.ts" = "export * from './CoApplicantInvite';`nexport * from './CoApplicantForm';`nexport * from './CoApplicantProgress';"
    "components\Shared\index.ts" = "export * from './ApplicationStatus';`nexport * from './DocumentViewer';`nexport * from './ScoreIndicator';"
    "components\index.ts" = "export * from './ApplicationWizard';`nexport * from './ApplicationReview';`nexport * from './Verification';`nexport * from './CoApplicants';`nexport * from './Shared';"
    "index.ts" = "export * from './types/application.types';`nexport * from './hooks/useApplication';`nexport * from './components';"
}

foreach ($idx in $indexFiles.Keys) {
    $fullPath = Join-Path $baseDir $idx
    Set-Content -Path $fullPath -Value $indexFiles[$idx] -Encoding UTF8
}

Write-Host "`n✅ Module 2.1 structure created: 45 files" -ForegroundColor Green
Write-Host "Run 'npm run build' to verify" -ForegroundColor Yellow

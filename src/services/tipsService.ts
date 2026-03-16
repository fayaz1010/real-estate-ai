import { Tip } from '@/types/tips';

let mockTips: Tip[] = [
  {
    id: 'tip-ai-property-recommendations',
    title: 'AI Property Recommendations',
    description:
      'Let our AI analyse market trends and your portfolio to recommend high-yield investment properties tailored to your goals. Properties matched by AI see 23% higher returns on average.',
    featureArea: 'AI Insights',
    relevanceScore: 92,
    ctaText: 'Explore Recommendations',
    ctaLink: '/dashboard?feature=ai-recommendations',
    dismissed: false,
    reason: '',
  },
  {
    id: 'tip-ai-chatbot',
    title: 'AI Chatbot for Tenants',
    description:
      'Deploy an AI-powered chatbot that handles tenant enquiries 24/7—maintenance requests, lease questions, and payment reminders—reducing your response time by up to 80%.',
    featureArea: 'Tenant Communication',
    relevanceScore: 85,
    ctaText: 'Set Up Chatbot',
    ctaLink: '/dashboard?feature=ai-chatbot',
    dismissed: false,
    reason: '',
  },
  {
    id: 'tip-smart-pricing',
    title: 'Smart Pricing Suggestions',
    description:
      'Our AI continuously monitors local rental markets and suggests optimal pricing for your units. Landlords using Smart Pricing fill vacancies 35% faster.',
    featureArea: 'Rent Optimisation',
    relevanceScore: 78,
    ctaText: 'View Pricing Insights',
    ctaLink: '/dashboard?feature=smart-pricing',
    dismissed: false,
    reason: '',
  },
  {
    id: 'tip-ai-tenant-screening',
    title: 'AI-Assisted Tenant Screening',
    description:
      'Speed up your tenant screening process with AI that analyses applications, credit history, and references in seconds—giving you a comprehensive risk score for every applicant.',
    featureArea: 'Tenant Screening',
    relevanceScore: 88,
    ctaText: 'Try Screening',
    ctaLink: '/applications',
    dismissed: false,
    reason: '',
  },
  {
    id: 'tip-predictive-maintenance',
    title: 'Predictive Maintenance Alerts',
    description:
      'Get ahead of costly repairs. Our AI predicts maintenance issues before they escalate, helping you save an average of $1,200 per property per year on emergency repairs.',
    featureArea: 'Predictive Maintenance',
    relevanceScore: 74,
    ctaText: 'Enable Alerts',
    ctaLink: '/maintenance',
    dismissed: false,
    reason: '',
  },
];

export async function getTips(_userId: string): Promise<Tip[]> {
  // Mock implementation — returns static data
  return Promise.resolve(mockTips.map((tip) => ({ ...tip })));
}

export async function updateTip(
  tipId: string,
  updates: Partial<Tip>
): Promise<Tip> {
  const index = mockTips.findIndex((t) => t.id === tipId);
  if (index === -1) {
    throw new Error(`Tip not found: ${tipId}`);
  }
  mockTips[index] = { ...mockTips[index], ...updates };
  return Promise.resolve({ ...mockTips[index] });
}

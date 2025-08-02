import { track } from '@vercel/analytics';

export const analytics = {
  // Track social link clicks
  trackSocialClick: (platform: string) => {
    track('social_link_click', { platform });
  },

  // Track page views (if needed for custom tracking)
  trackPageView: (page: string) => {
    track('page_view', { page });
  },

  // Track custom events
  trackEvent: (event: string, properties?: Record<string, string | number | boolean>) => {
    track(event, properties);
  },
}; 
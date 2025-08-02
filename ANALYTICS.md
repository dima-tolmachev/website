# Analytics Implementation

This website uses Vercel Analytics for tracking user interactions and performance metrics.

## What's Tracked

### Automatic Tracking
- **Page Views**: All page visits are automatically tracked
- **Performance Metrics**: Core Web Vitals and performance data via Speed Insights
- **Geographic Data**: Visitor locations (anonymized)
- **Device Information**: Browser, OS, and device type

### Custom Events
- **Social Link Clicks**: Tracks when users click on LinkedIn, GitHub, or YouTube links
- **Custom Events**: Framework for adding more specific tracking as needed

## Implementation Details

### Core Setup
- **Vercel Analytics**: `@vercel/analytics` package for basic tracking
- **Speed Insights**: `@vercel/speed-insights` for performance monitoring
- **Placement**: Both components are in `src/app/layout.tsx` for site-wide coverage
- **Environment Detection**: Automatically switches between production/development modes

### Custom Tracking
- **Analytics Utility**: `src/lib/analytics.ts` contains reusable tracking functions
- **Social Links**: Enhanced with click tracking in `src/components/social-links.tsx`

## Privacy & Compliance

- **GDPR Compliant**: Vercel Analytics respects user privacy
- **No Personal Data**: Only anonymous usage statistics are collected
- **Opt-out Available**: Users can disable tracking via browser settings
- **Environment Aware**: Analytics only send data in production, not during development

## Adding New Tracking

To add custom event tracking:

```typescript
import { analytics } from '@/lib/analytics';

// Track a custom event
analytics.trackEvent('button_click', { button: 'contact_form' });

// Track social link clicks (already implemented)
analytics.trackSocialClick('linkedin');
```

## Viewing Analytics

1. Go to your Vercel Dashboard
2. Select your project
3. Navigate to the "Analytics" tab
4. View real-time and historical data

## Environment Detection

The analytics automatically detect the environment:

- **Development** (`npm run dev`): Analytics disabled to prevent noise
- **Production** (deployed): Analytics enabled for real user data
- **Testing**: Analytics disabled to keep data clean

This is handled automatically by checking `process.env.NODE_ENV`.

## Performance Impact

- **Minimal**: Analytics scripts are loaded asynchronously
- **No Blocking**: Page rendering is not affected
- **Optimized**: Vercel handles all optimization automatically 
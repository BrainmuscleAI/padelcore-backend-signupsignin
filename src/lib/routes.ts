export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  LIVE: '/live',
  PLAYER_DASHBOARD: '/dashboard/player',
  ADMIN_DASHBOARD: '/dashboard/admin',
  SPONSOR_DASHBOARD: '/dashboard/sponsor',
  FEATURES: '/features',
  RANKINGS: '/rankings',
  COMMUNITY: '/community',
  ABOUT: '/about',
  PRICING: '/pricing',
  TUTORIALS: '/tutorials',
  TOURNAMENTS: '/tournaments',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
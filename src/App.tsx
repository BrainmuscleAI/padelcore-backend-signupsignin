import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { NotificationsProvider } from '@/components/notifications/notifications-provider';
import { RootLayout } from '@/components/layouts/root-layout';
import { LandingPage } from '@/components/landing-page';
import { PlayerDashboard } from '@/components/dashboard/player-dashboard';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { SponsorDashboard } from '@/components/dashboard/sponsor-dashboard';
import { LiveStreaming } from '@/components/live/live-streaming';
import { SocialFeed } from '@/components/feed/social-feed';
import { PublicFeed } from '@/components/feed/public-feed';
import { PricingPage } from '@/components/pricing/pricing-page';
import { RankingsPage } from '@/components/rankings/rankings-page';
import { CommunityPage } from '@/components/community/community-page';
import { TutorialsPage } from '@/components/tutorials/tutorials-page';
import { TournamentsPage } from '@/components/tournaments/tournaments-page';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useAuth } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

function DashboardRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'sponsor':
      return <SponsorDashboard />;
    default:
      return <PlayerDashboard />;
  }
}

function AppContent() {
  return (
    <RootLayout>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.PRICING} element={<PricingPage />} />
        <Route path={ROUTES.FEED} element={<PublicFeed />} />
        <Route path={ROUTES.RANKINGS} element={<RankingsPage />} />
        <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
        <Route path={ROUTES.TUTORIALS} element={<TutorialsPage />} />
        <Route path={ROUTES.TOURNAMENTS} element={<TournamentsPage />} />
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout>
              <DashboardRoute />
            </DashboardLayout>
          }
        />
        <Route path={ROUTES.LIVE} element={<LiveStreaming />} />
      </Routes>
    </RootLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
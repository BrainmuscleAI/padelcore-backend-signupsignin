import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Activity, LogOut, Video } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { NotificationsBell } from '../notifications/notifications-bell';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  const goToLive = () => {
    window.location.pathname = '/live';
  };

  const goToDashboard = () => {
    window.location.pathname = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={goToDashboard}>
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Padel Core</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={goToLive}
                className="hover:text-primary transition-colors"
              >
                <Video className="h-5 w-5 mr-2" />
                En Vivo
              </Button>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <NotificationsBell />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="hover:text-primary transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
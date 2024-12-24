import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Crown } from 'lucide-react';
import { SignInDialog } from './auth/sign-in-dialog';
import { SignUpDialog } from './auth/sign-up-dialog';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './auth/user-menu';
import { useAuth } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';
import { NotificationsBell } from './notifications/notifications-bell';
import { useToast } from '@/hooks/use-toast';

export function Navbar() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuthAction = (action: 'signin' | 'signup') => {
    if (action === 'signin') {
      setShowSignIn(true);
    } else {
      setShowSignUp(true);
    }
  };

  const handleNavigation = (path: string) => {
    if (!user && [ROUTES.DASHBOARD, ROUTES.LIVE].includes(path)) {
      toast({
        title: "Acceso Restringido",
        description: "Por favor inicia sesión para acceder a esta función.",
      });
      setShowSignIn(true);
      return false;
    }
    return true;
  };

  const handleLogoClick = () => {
    if (user) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={handleLogoClick}
            >
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Padel Core</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              {[
                { path: ROUTES.RANKINGS, label: 'Rankings' },
                { path: ROUTES.COMMUNITY, label: 'Comunidad' },
                { path: ROUTES.TUTORIALS, label: 'Tutoriales' },
                { path: ROUTES.TOURNAMENTS, label: 'Torneos' },
                { path: ROUTES.FEED, label: 'Feed' },
                { path: ROUTES.LIVE, label: 'En Vivo' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={(e) => !handleNavigation(path) && e.preventDefault()}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === path ? 'text-primary' : ''
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link to={ROUTES.PRICING}>
                <Button variant="outline" className="hover:text-primary transition-colors">
                  <Crown className="h-4 w-4 mr-2" />
                  Platino
                </Button>
              </Link>
              <ThemeToggle />
              {user ? (
                <>
                  <NotificationsBell />
                  <UserMenu />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleAuthAction('signin')}
                    className="hover:text-primary transition-colors"
                  >
                    Entrar
                  </Button>
                  <Button 
                    onClick={() => handleAuthAction('signup')}
                    className="hover:bg-primary/90 transition-colors"
                  >
                    Registrarse
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
      <SignUpDialog open={showSignUp} onOpenChange={setShowSignUp} />
    </>
  );
}
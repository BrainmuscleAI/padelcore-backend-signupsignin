import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Star } from 'lucide-react';
import { useGsapHeroAnimation } from '@/hooks/use-gsap';
import { CTAModal } from './cta-modal';
import { useAuth } from '@/lib/auth';

export function HeroSection() {
  const containerRef = useGsapHeroAnimation();
  const { user } = useAuth();
  const [showCTAModal, setShowCTAModal] = useState(false);

  const handleCTAClick = () => {
    if (!user) {
      setShowCTAModal(true);
    } else {
      // If user is already logged in, handle differently
      window.location.pathname = '/pricing';
    }
  };

  return (
    <div className="relative min-h-screen flex items-center" ref={containerRef}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-bold tracking-tight hero-title">
              Eleva Tu{' '}
              <span className="text-primary">Juego de Padel</span>
            </h1>
            <p className="text-xl text-muted-foreground hero-description">
              Únete a la plataforma líder de padel en México. Compite, mejora y forma parte de nuestra comunidad.
            </p>
            <div className="flex flex-wrap gap-4 hero-buttons">
              <Button size="lg" onClick={handleCTAClick}>
                Comenzar Ahora
              </Button>
              <Button size="lg" variant="outline">
                Conocer Más
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Rankings</h3>
                  <p className="text-sm text-muted-foreground">Rankings en tiempo real</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Comunidad</h3>
                  <p className="text-sm text-muted-foreground">Conecta con jugadores</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Progreso</h3>
                  <p className="text-sm text-muted-foreground">Sigue tu evolución</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 hero-image">
            <img
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop"
              alt="Cancha de Padel"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>

      <CTAModal open={showCTAModal} onOpenChange={setShowCTAModal} />
    </div>
  );
}
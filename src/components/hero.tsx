import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Star, Crown } from 'lucide-react';
import { useGsapHeroAnimation } from '@/hooks/use-gsap';
import { CTAModal } from './cta-modal';
import { useAuth } from '@/lib/auth';
import { ROUTES } from '@/lib/routes';

export function Hero() {
  const containerRef = useGsapHeroAnimation();
  const { user } = useAuth();
  const [showCTAModal, setShowCTAModal] = useState(false);

  const handleCTAClick = () => {
    if (!user) {
      setShowCTAModal(true);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center" ref={containerRef}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop"
          alt="Padel Court"
          className="w-full h-full object-cover brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Crown className="h-5 w-5" />
              <span>La plataforma líder de padel en México</span>
            </div>

            <h1 className="text-6xl font-bold tracking-tight hero-title">
              Eleva Tu{' '}
              <span className="text-primary">Juego de Padel</span>{' '}
              al Siguiente Nivel
            </h1>

            <p className="text-xl text-muted-foreground hero-description max-w-2xl">
              Únete a la comunidad más grande de padel en México. Compite en torneos,
              mejora tu ranking y conéctate con jugadores de tu nivel.
            </p>

            <div className="flex flex-wrap gap-4 hero-buttons">
              <Link to={ROUTES.PRICING}>
                <Button size="lg" className="text-lg px-8">
                  <Crown className="h-5 w-5 mr-2" />
                  Prueba Platino Gratis
                </Button>
              </Link>
              <Link to={ROUTES.RANKINGS}>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explorar Rankings
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-bold">150+</h3>
                  <p className="text-muted-foreground">Torneos al año</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-bold">10K+</h3>
                  <p className="text-muted-foreground">Jugadores activos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-bold">4.9/5</h3>
                  <p className="text-muted-foreground">Calificación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTAModal open={showCTAModal} onOpenChange={setShowCTAModal} />
    </div>
  );
}
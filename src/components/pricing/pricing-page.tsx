import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { SignInDialog } from '../auth/sign-in-dialog';
import { PaymentDialog } from './payment-dialog';
import {
  Check,
  Crown,
  Trophy,
  Users,
  Video,
  Star,
  Shield,
  Zap,
} from 'lucide-react';

const FEATURES_PLATINUM = [
  'Acceso ilimitado a transmisiones en vivo',
  'Prioridad en inscripción a torneos',
  'Análisis avanzado de estadísticas',
  'Entrenamiento personalizado con IA',
  'Descuentos exclusivos con patrocinadores',
  'Insignia Platino en perfil',
  'Soporte prioritario 24/7',
  'Sin anuncios',
  'Acceso a eventos VIP',
  'Reserva prioritaria de canchas',
];

const PLANS = [
  {
    name: 'Básico',
    price: 'Gratis',
    description: 'Para jugadores casuales',
    features: [
      'Perfil básico',
      'Participación en rankings',
      'Chat comunitario',
      'Acceso al feed social',
    ],
  },
  {
    name: 'Platino',
    price: '$999',
    period: '/mes',
    description: 'Para jugadores comprometidos',
    features: FEATURES_PLATINUM,
    popular: true,
  },
];

export function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    if (!user) {
      setShowSignIn(true);
      return;
    }

    if (planName === 'Platino') {
      setSelectedPlan(planName);
      setShowPayment(true);
    } else {
      toast({
        title: 'Plan Seleccionado',
        description: 'Ya estás en el plan básico.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Eleva tu Juego al Siguiente Nivel
            </h1>
            <p className="text-xl text-muted-foreground">
              Únete a la élite del padel con nuestra membresía Platino y accede a
              beneficios exclusivos.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`p-8 relative ${
                plan.popular ? 'border-primary shadow-lg' : ''
              }`}>
                {plan.popular && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    variant="secondary"
                  >
                    Más Popular
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {plan.popular ? 'Comenzar Ahora' : 'Continuar Gratis'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Torneos Exclusivos</h3>
            <p className="text-muted-foreground">
              Acceso prioritario a los mejores torneos y eventos especiales.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <Video className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Transmisiones Premium</h3>
            <p className="text-muted-foreground">
              Disfruta de todas las transmisiones en vivo sin interrupciones.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <Star className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Beneficios VIP</h3>
            <p className="text-muted-foreground">
              Descuentos exclusivos y acceso prioritario a instalaciones.
            </p>
          </motion.div>
        </div>
      </div>

      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
      <PaymentDialog 
        open={showPayment} 
        onOpenChange={setShowPayment}
        plan={selectedPlan}
      />
    </div>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, ArrowRight } from 'lucide-react';
import { useActions } from '@/lib/actions';
import { PaymentDialog } from './pricing/payment-dialog';

interface CTAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CTAModal({ open, onOpenChange }: CTAModalProps) {
  const { goToPricing } = useActions();
  const [showPayment, setShowPayment] = useState(false);

  const features = [
    'Acceso ilimitado a transmisiones en vivo',
    'Prioridad en inscripción a torneos',
    'Análisis avanzado de estadísticas',
    'Entrenamiento personalizado con IA',
    'Descuentos exclusivos',
  ];

  const handleGetStarted = () => {
    setShowPayment(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
              <Crown className="h-6 w-6 text-primary" />
              Membresía Platino
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-4"
          >
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-bold">$999 MXN/mes</h3>
              <p className="text-muted-foreground">
                Únete a la élite del padel y lleva tu juego al siguiente nivel
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <Button 
                className="w-full text-lg h-12" 
                onClick={handleGetStarted}
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancela en cualquier momento. Sin compromisos.
              </p>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <PaymentDialog 
        open={showPayment} 
        onOpenChange={setShowPayment}
        plan="Platino"
      />
    </>
  );
}
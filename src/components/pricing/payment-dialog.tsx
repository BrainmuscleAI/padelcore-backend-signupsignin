import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useActions } from '@/lib/actions';
import { Loader2, Check, CreditCard } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string | null;
}

export function PaymentDialog({ open, onOpenChange, plan }: PaymentDialogProps) {
  const { toast } = useToast();
  const { handlePaymentSuccess } = useActions();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setStep(2);
    setLoading(false);

    // Show success message and redirect
    setTimeout(() => {
      onOpenChange(false);
      setStep(1);
      handlePaymentSuccess();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Membresía Platino</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Número de Tarjeta</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="4242 4242 4242 4242"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        number: formatCardNumber(e.target.value),
                      })}
                      className="pl-10"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nombre en la Tarjeta</Label>
                  <Input
                    placeholder="JUAN PÉREZ"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      name: e.target.value.toUpperCase(),
                    })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha de Expiración</Label>
                    <Input
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        expiry: formatExpiry(e.target.value),
                      })}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <Input
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        cvc: e.target.value.replace(/\D/g, ''),
                      })}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Pagar $999 MXN'
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground pt-4">
                  Tus pagos están seguros y encriptados
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">¡Pago Exitoso!</h3>
              <p className="text-muted-foreground">
                Tu membresía Platino está siendo activada...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
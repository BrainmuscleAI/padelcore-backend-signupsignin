import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActions } from '@/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export function About() {
  const { contactSupport } = useActions();
  const [message, setMessage] = useState('');
  const [showContact, setShowContact] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    contactSupport(message);
    setMessage('');
    setShowContact(false);
  };

  return (
    <section className="container mx-auto px-4 py-24" id="nosotros">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Sobre Nosotros
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Somos apasionados del padel comprometidos en crear la mejor plataforma para jugadores mexicanos de todos los niveles.
            Nuestra misión es hacer crecer la comunidad del padel en México y ayudar a los jugadores a alcanzar su máximo potencial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-lg border lighting-card hover:shadow-lg hover:border-primary/50 transition-all"
          >
            <Mail className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Correo</h3>
            <p className="text-muted-foreground">contacto@padelcore.mx</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-lg border lighting-card hover:shadow-lg hover:border-primary/50 transition-all"
          >
            <Phone className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
            <p className="text-muted-foreground">+52 777 123 4567</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-lg border lighting-card hover:shadow-lg hover:border-primary/50 transition-all"
          >
            <MapPin className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
            <p className="text-muted-foreground">Cuernavaca, Morelos</p>
          </motion.div>
        </div>

        <div className="max-w-md mx-auto text-center">
          <Dialog open={showContact} onOpenChange={setShowContact}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="hover:bg-primary/90 transition-colors"
              >
                Contáctanos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Envíanos un Mensaje</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Escribe tu mensaje aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button type="submit" className="w-full">
                  Enviar Mensaje
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>
    </section>
  );
}
import { Trophy, TrendingUp, Users, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Rankings Inteligentes',
    description: 'Sistema de clasificación impulsado por IA que se adapta a tu estilo de juego y rendimiento.',
    icon: Trophy,
  },
  {
    title: 'Análisis de Rendimiento',
    description: 'Sigue tu progreso con estadísticas detalladas y perspectivas personalizadas.',
    icon: TrendingUp,
  },
  {
    title: 'Partidos Comunitarios',
    description: 'Encuentra y desafía a jugadores de tu nivel en tu área local.',
    icon: Users,
  },
  {
    title: 'Entrenador IA',
    description: 'Recibe consejos y estrategias personalizadas para mejorar tu juego.',
    icon: Brain,
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-4 py-24" id="caracteristicas">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="lighting-card hover:shadow-lg hover:border-primary/50 transition-all">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
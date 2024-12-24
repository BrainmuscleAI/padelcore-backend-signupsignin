import { useGsapCardAnimation } from '@/hooks/use-gsap';
import { Card } from '@/components/ui/card';
import { Play, Trophy, Users, Star, TrendingUp, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BentoItem {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  size?: 'small' | 'large';
  image?: string;
  stats?: {
    label: string;
    value: string;
  }[];
}

const bentoItems: BentoItem[] = [
  {
    title: 'Torneo Nacional en Vivo',
    description: 'Final del Torneo Nacional de Padel 2024 - ¡No te lo pierdas!',
    icon: Play,
    link: '/live',
    size: 'large',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    stats: [
      { label: 'Espectadores', value: '1.2K' },
      { label: 'Sets', value: '2-1' },
    ],
  },
  {
    title: 'Rankings Actuales',
    description: 'Top jugadores de la temporada',
    icon: Trophy,
    link: '/rankings',
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd5c?w=800&q=80',
    stats: [
      { label: 'Jugadores', value: '156' },
    ],
  },
  {
    title: 'Comunidad Activa',
    description: 'Conecta con jugadores de tu nivel',
    icon: Users,
    link: '/community',
    image: 'https://images.unsplash.com/photo-1591491653056-4028bd769982?w=800&q=80',
    stats: [
      { label: 'Miembros', value: '2.4K' },
    ],
  },
  {
    title: 'Próximos Torneos',
    description: 'Calendario de competencias y eventos especiales',
    icon: Star,
    link: '/tournaments',
    size: 'large',
    image: 'https://images.unsplash.com/photo-1587385789097-0197a7fbd179?w=1200&q=80',
    stats: [
      { label: 'Torneos', value: '8' },
      { label: 'Premios', value: '$50K' },
    ],
  },
  {
    title: 'Tutoriales y Tips',
    description: 'Mejora tu técnica con nuestros expertos',
    icon: Video,
    link: '/videos',
    image: 'https://images.unsplash.com/photo-1587385789097-0197a7fbd179?w=800&q=80',
    stats: [
      { label: 'Videos', value: '45+' },
    ],
  },
];

export function BentoGrid() {
  const cardRef = useGsapCardAnimation();

  return (
    <section className="container mx-auto px-4 py-12">
      <div ref={cardRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bentoItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className={`${
              item.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 lighting-card">
                <div className="relative h-48 overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-white">
                      <item.icon className="h-5 w-5" />
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  {item.stats && (
                    <div className="flex gap-4">
                      {item.stats.map((stat, idx) => (
                        <div key={idx} className="flex-1">
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-lg font-semibold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
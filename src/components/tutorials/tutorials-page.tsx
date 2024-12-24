import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play,
  Search,
  Filter,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  BookOpen,
  Trophy,
  Star,
} from 'lucide-react';

const tutorials = [
  {
    id: 1,
    title: 'Técnica Básica del Saque',
    thumbnail: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    duration: '15:30',
    views: '12.5K',
    likes: 856,
    level: 'Principiante',
    instructor: 'Carlos Ramírez',
    description: 'Aprende los fundamentos del saque perfecto en padel.',
  },
  {
    id: 2,
    title: 'Estrategias Avanzadas de Dobles',
    thumbnail: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd5c?w=800&q=80',
    duration: '22:45',
    views: '8.2K',
    likes: 645,
    level: 'Avanzado',
    instructor: 'Ana González',
    description: 'Domina las tácticas de juego en pareja.',
  },
  // Add more tutorials...
];

export function TutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Tutoriales y Tips</h1>
            <p className="text-muted-foreground">
              Mejora tu juego con nuestros expertos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Buscar tutoriales..."
              className="w-64"
              icon={Search}
            />
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="lg">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2">
                    {tutorial.level}
                  </Badge>
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-md text-white text-sm flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tutorial.duration}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tutorial.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {tutorial.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        24
                      </span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
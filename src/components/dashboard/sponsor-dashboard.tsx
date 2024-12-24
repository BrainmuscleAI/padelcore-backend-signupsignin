import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Image as ImageIcon,
  Upload,
  Play,
  PlusCircle,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Target,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import { Badge } from '@/components/ui/badge';

interface Campaign {
  id: string;
  title: string;
  type: 'banner' | 'video' | 'post';
  status: 'active' | 'scheduled' | 'ended';
  startDate: string;
  endDate: string;
  budget: number;
  impressions: number;
  clicks: number;
}

interface AdSpot {
  id: string;
  location: string;
  type: 'banner' | 'video';
  size: string;
  price: number;
  availability: 'available' | 'reserved' | 'occupied';
}

export function SponsorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Torneo de Verano',
      type: 'banner',
      status: 'active',
      startDate: '2024-04-15',
      endDate: '2024-05-15',
      budget: 5000,
      impressions: 12500,
      clicks: 450,
    },
    {
      id: '2',
      title: 'Promoción Equipamiento',
      type: 'video',
      status: 'scheduled',
      startDate: '2024-05-01',
      endDate: '2024-05-30',
      budget: 8000,
      impressions: 0,
      clicks: 0,
    },
  ]);

  const adSpots: AdSpot[] = [
    {
      id: '1',
      location: 'Página Principal - Header',
      type: 'banner',
      size: '728x90',
      price: 1000,
      availability: 'available',
    },
    {
      id: '2',
      location: 'Transmisión En Vivo',
      type: 'video',
      size: '30 segundos',
      price: 2000,
      availability: 'available',
    },
    {
      id: '3',
      location: 'Feed Social',
      type: 'banner',
      size: '300x250',
      price: 800,
      availability: 'reserved',
    },
  ];

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    type: 'banner',
    startDate: '',
    endDate: '',
    budget: '',
  });

  const handleCreateCampaign = () => {
    const campaign: Campaign = {
      id: Math.random().toString(),
      ...newCampaign,
      status: 'scheduled',
      impressions: 0,
      clicks: 0,
      budget: Number(newCampaign.budget),
    };

    setCampaigns([...campaigns, campaign]);
    toast({
      title: 'Campaña Creada',
      description: 'La campaña ha sido creada exitosamente.',
    });
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast({
      title: 'Campaña Eliminada',
      description: 'La campaña ha sido eliminada exitosamente.',
    });
  };

  const handleReserveSpot = (spotId: string) => {
    toast({
      title: 'Espacio Reservado',
      description: 'Se ha enviado la solicitud de reserva.',
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Patrocinador</h1>
          <p className="text-muted-foreground">{user?.companyName}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Campaña</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Título de la Campaña</Label>
                <Input
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="Ej: Promoción de Verano"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Fin</Label>
                  <Input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Presupuesto (MXN)</Label>
                <Input
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                  placeholder="5000"
                />
              </div>
              <Button onClick={handleCreateCampaign} className="w-full">
                Crear Campaña
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="spots">Espacios Publicitarios</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{campaign.title}</h3>
                        <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {campaign.budget} MXN
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.impressions}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>{campaign.clicks}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="spots">
          <div className="grid gap-4">
            {adSpots.map((spot) => (
              <Card key={spot.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{spot.location}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {spot.type === 'banner' ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        {spot.type} - {spot.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {spot.price} MXN/mes
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleReserveSpot(spot.id)}
                    disabled={spot.availability !== 'available'}
                  >
                    {spot.availability === 'available' ? 'Reservar' : 'No Disponible'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resumen de Rendimiento</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Este Mes
                  </Button>
                  <Button variant="outline" size="sm">
                    Últimos 3 Meses
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <Eye className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Impresiones Totales</p>
                      <p className="text-2xl font-bold">45,892</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <Target className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Clics Totales</p>
                      <p className="text-2xl font-bold">2,156</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">CTR Promedio</p>
                      <p className="text-2xl font-bold">4.7%</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="aspect-[2/1] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfica de rendimiento (Demo)</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
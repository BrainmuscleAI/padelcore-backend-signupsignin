import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';
import { calculateTier } from '@/lib/ranking';
import { cn } from '@/lib/utils';

interface RankingCardProps {
  rating: number;
}

export function RankingCard({ rating }: RankingCardProps) {
  const { tier, color, nextTier } = calculateTier(rating);
  const progress = nextTier
    ? ((rating - (nextTier.rating - 200)) / 200) * 100
    : 100;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Ranking Actual</h3>
          <p className={cn('text-2xl font-bold', color)}>{tier}</p>
        </div>
        <Trophy className={cn('h-8 w-8', color)} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Rating: {rating}</span>
          {nextTier && <span>Próximo: {nextTier.name}</span>}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <p className="text-sm text-muted-foreground">
        {nextTier
          ? `${nextTier.rating - rating} puntos para el siguiente nivel`
          : '¡Has alcanzado el máximo nivel!'}
      </p>
    </Card>
  );
}
interface MatchResult {
  winner: string;
  loser: string;
  score: string;
  tournament?: string;
  date: string;
}

interface PlayerStats {
  id: string;
  name: string;
  rating: number;
  matches: number;
  wins: number;
  losses: number;
  winStreak: number;
  tournaments: number;
  lastMatches: MatchResult[];
}

// ELO-based rating system with modifications for padel
export function calculateNewRating(
  playerRating: number,
  opponentRating: number,
  result: 'win' | 'loss',
  tournamentFactor: number = 1
): number {
  const K = 32 * tournamentFactor; // K-factor (higher for important matches)
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  const actualScore = result === 'win' ? 1 : 0;
  
  return Math.round(playerRating + K * (actualScore - expectedScore));
}

// Progressive rating adjustments based on win streaks
export function applyWinStreakBonus(rating: number, winStreak: number): number {
  if (winStreak >= 3) {
    const bonus = Math.min(winStreak * 5, 25); // Max bonus of 25 points
    return rating + bonus;
  }
  return rating;
}

// Tournament performance impact
export function calculateTournamentBonus(
  position: number,
  participants: number,
  tournamentTier: 'local' | 'regional' | 'national'
): number {
  const tierMultiplier = {
    local: 1,
    regional: 1.5,
    national: 2,
  };

  const positionFactor = Math.max(0, (participants - position) / participants);
  return Math.round(50 * positionFactor * tierMultiplier[tournamentTier]);
}

// Activity decay
export function applyInactivityPenalty(rating: number, daysInactive: number): number {
  if (daysInactive > 30) {
    const penalty = Math.min(Math.floor((daysInactive - 30) / 7) * 5, 50);
    return rating - penalty;
  }
  return rating;
}

// Seasonal reset
export function calculateSeasonalReset(rating: number): number {
  const baseRating = 1000;
  return Math.round(baseRating + (rating - baseRating) * 0.8);
}

// Calculate player ranking tier
export function calculateTier(rating: number): {
  tier: string;
  color: string;
  nextTier: { rating: number; name: string } | null;
} {
  const tiers = [
    { min: 2000, name: 'Elite', color: 'text-yellow-500' },
    { min: 1800, name: 'Diamante', color: 'text-blue-500' },
    { min: 1600, name: 'Platino', color: 'text-purple-500' },
    { min: 1400, name: 'Oro', color: 'text-yellow-600' },
    { min: 1200, name: 'Plata', color: 'text-gray-400' },
    { min: 1000, name: 'Bronce', color: 'text-orange-600' },
    { min: 0, name: 'Principiante', color: 'text-green-500' },
  ];

  const currentTier = tiers.find(tier => rating >= tier.min);
  const nextTierIndex = tiers.indexOf(currentTier!) - 1;
  const nextTier = nextTierIndex >= 0 ? {
    rating: tiers[nextTierIndex].min,
    name: tiers[nextTierIndex].name,
  } : null;

  return {
    tier: currentTier!.name,
    color: currentTier!.color,
    nextTier,
  };
}
import type { Game, PeriodSelection, Player, RankingRow } from '@/types/game';
import { getPeriodSelectionError, isDateInRange, resolvePeriodRange } from '@/utils/date';

export function sortGamesByNewest(games: readonly Game[]) {
  return [...games].sort((left, right) => {
    if (left.date !== right.date) {
      return right.date.localeCompare(left.date);
    }

    return right.createdAt - left.createdAt;
  });
}

export function filterGamesByPeriod(games: readonly Game[], selection: PeriodSelection) {
  if (getPeriodSelectionError(selection)) {
    return [];
  }

  const range = resolvePeriodRange(selection);

  if (!range) {
    return [...games];
  }

  return games.filter((game) => isDateInRange(game.date, range.startDate, range.endDate));
}

export function buildRanking(games: readonly Game[], players: readonly Player[]): RankingRow[] {
  const rows = players.map<RankingRow>((player) => ({
    playerId: player.id,
    playerName: player.name,
    firstPlaces: 0,
    secondPlaces: 0,
    thirdPlaces: 0,
    totalPoints: 0,
  }));

  for (const game of games) {
    for (const participant of game.participants) {
      const row = rows.find((candidate) => candidate.playerId === participant.playerId);

      if (!row) {
        continue;
      }

      row.totalPoints += participant.points;

      if (participant.rank === 1) {
        row.firstPlaces += 1;
      } else if (participant.rank === 2) {
        row.secondPlaces += 1;
      } else {
        row.thirdPlaces += 1;
      }
    }
  }

  return rows.sort((left, right) => {
    if (left.firstPlaces !== right.firstPlaces) {
      return right.firstPlaces - left.firstPlaces;
    }

    if (left.secondPlaces !== right.secondPlaces) {
      return right.secondPlaces - left.secondPlaces;
    }

    if (left.thirdPlaces !== right.thirdPlaces) {
      return left.thirdPlaces - right.thirdPlaces;
    }

    return right.totalPoints - left.totalPoints;
  });
}

import type {
  Game,
  GameParticipant,
  PeriodSelection,
  Player,
  PlayerId,
  Rank,
  RankingRow,
} from '@/types/game';
import { getPeriodSelectionError, isDateInRange, resolvePeriodRange } from '@/utils/date';

const PLAYER_ORDER: Record<PlayerId, number> = {
  me: 0,
  'older-brother': 1,
  'younger-brother': 2,
};

export function rankParticipantsByPoints(
  participants: readonly Pick<GameParticipant, 'playerId' | 'points'>[],
): [GameParticipant, GameParticipant, GameParticipant] {
  const sortedParticipants = [...participants].sort((left, right) => {
    if (left.points !== right.points) {
      return right.points - left.points;
    }

    return PLAYER_ORDER[left.playerId] - PLAYER_ORDER[right.playerId];
  });

  let currentRank = 1;
  let previousPoints: number | null = null;

  return sortedParticipants.map<GameParticipant>((participant, index) => {
    if (previousPoints !== null && participant.points < previousPoints) {
      currentRank = index + 1;
    }

    previousPoints = participant.points;

    return {
      ...participant,
      rank: currentRank as Rank,
    };
  }) as [GameParticipant, GameParticipant, GameParticipant];
}

export function normalizeGameRanks(game: Game): Game {
  return {
    ...game,
    participants: rankParticipantsByPoints(
      game.participants.map((participant) => ({
        playerId: participant.playerId,
        points: participant.points,
      })),
    ),
  };
}

export function sortParticipantsForDisplay(participants: readonly GameParticipant[]) {
  return [...participants].sort((left, right) => {
    if (left.rank !== right.rank) {
      return left.rank - right.rank;
    }

    if (left.points !== right.points) {
      return right.points - left.points;
    }

    return PLAYER_ORDER[left.playerId] - PLAYER_ORDER[right.playerId];
  });
}

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
    displayRank: 0,
    playerId: player.id,
    playerName: player.name,
    firstPlaces: 0,
    secondPlaces: 0,
    thirdPlaces: 0,
    totalPoints: 0,
  }));

  for (const game of games) {
    for (const participant of normalizeGameRanks(game).participants) {
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

  const sortedRows = rows.sort((left, right) => {
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

  let previousRow: RankingRow | null = null;
  let previousDisplayRank = 1;

  return sortedRows.map((row, index) => {
    const isTiedWithPrevious =
      previousRow &&
      row.firstPlaces === previousRow.firstPlaces &&
      row.secondPlaces === previousRow.secondPlaces &&
      row.thirdPlaces === previousRow.thirdPlaces &&
      row.totalPoints === previousRow.totalPoints;

    const displayRank = isTiedWithPrevious ? previousDisplayRank : index + 1;
    previousRow = row;
    previousDisplayRank = displayRank;

    return {
      ...row,
      displayRank,
    };
  });
}

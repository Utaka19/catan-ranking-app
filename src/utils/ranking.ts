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

export function getOverallScoreForRank(rank: number) {
  if (rank === 1) {
    return 3;
  }

  if (rank === 2) {
    return 2;
  }

  if (rank === 3) {
    return 1;
  }

  return 0;
}

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
    overallScore: 0,
    totalPoints: 0,
  }));

  for (const game of games) {
    for (const participant of normalizeGameRanks(game).participants) {
      const row = rows.find((candidate) => candidate.playerId === participant.playerId);

      if (!row) {
        continue;
      }

      row.overallScore += getOverallScoreForRank(participant.rank);
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
    if (left.overallScore !== right.overallScore) {
      return right.overallScore - left.overallScore;
    }

    if (left.totalPoints !== right.totalPoints) {
      return right.totalPoints - left.totalPoints;
    }

    return PLAYER_ORDER[left.playerId] - PLAYER_ORDER[right.playerId];
  });

  let previousRow: RankingRow | null = null;
  let previousDisplayRank = 1;

  return sortedRows.map((row, index) => {
    const isTiedWithPrevious =
      previousRow &&
      row.overallScore === previousRow.overallScore &&
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

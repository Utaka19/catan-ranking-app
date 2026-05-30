import type { GameParticipant, RankingRow } from '@/types/game';

export type IslandKing = {
  heading: string;
  names: string;
  title: string;
};

export type RankBadgeTone = 'gold' | 'silver' | 'bronze' | 'muted';

export function getRankBadgeTone(rank: number): RankBadgeTone {
  if (rank === 1) {
    return 'gold';
  }

  if (rank === 2) {
    return 'silver';
  }

  if (rank === 3) {
    return 'bronze';
  }

  return 'muted';
}

function getRankGroupSize(displayRank: number, rows: readonly RankingRow[]) {
  return rows.filter((row) => row.displayRank === displayRank).length;
}

function getLowestDisplayRank(rows: readonly RankingRow[]) {
  return Math.max(...rows.map((row) => row.displayRank));
}

export function getOverallTitle(row: RankingRow, rows: readonly RankingRow[]) {
  const displayRank = row.displayRank > 0 ? row.displayRank : 1;
  const sameRankCount = getRankGroupSize(displayRank, rows);
  const isTied = sameRankCount > 1;
  const isTiedLast = displayRank === getLowestDisplayRank(rows) && isTied;

  if (displayRank === 1 && isTied) {
    return '⚔️ 双璧の覇者';
  }

  if (displayRank === 1) {
    return '👑 島を統べる大王';
  }

  if (displayRank === 2 && isTied) {
    return '🛖 名もなき領主';
  }

  if (displayRank === 2) {
    return '🛡️ 王の右腕';
  }

  if (displayRank === 3 && isTiedLast) {
    return '📦 資源係';
  }

  return '🐑 羊泥棒';
}

export function getIslandKing(rows: readonly RankingRow[]): IslandKing | null {
  if (rows.length === 0) {
    return null;
  }

  const topRows = rows.filter((row) => row.displayRank === 1);

  if (topRows.length === 0) {
    return null;
  }

  if (topRows.length > 1) {
    return {
      heading: '⚔️ 現在の島王候補',
      names: topRows.map((row) => row.playerName).join(' / '),
      title: '双璧の覇者',
    };
  }

  return {
    heading: '👑 現在の島王',
    names: topRows[0].playerName,
    title: '島を統べる大王',
  };
}

function getPointForRank(rank: number, participants: readonly GameParticipant[]) {
  return participants.find((participant) => participant.rank === rank)?.points ?? null;
}

export function getMatchTitle(
  participant: GameParticipant,
  participants: readonly GameParticipant[],
) {
  const secondPlacePoint = getPointForRank(2, participants);

  if (participant.rank === 1) {
    const nextPoint =
      participants.find(
        (candidate) => candidate.playerId !== participant.playerId && candidate.points <= participant.points,
      )?.points ?? participant.points;
    const difference = participant.points - nextPoint;

    if (difference >= 3) {
      return '👑 今日は別格';
    }

    if (difference >= 1) {
      return '🏆 本日の勝者';
    }

    return '🔥 首の皮一枚';
  }

  if (participant.rank === 2) {
    const tiedSecondCount = participants.filter((candidate) => candidate.rank === 2).length;

    if (tiedSecondCount > 1) {
      return '🐑 羊分け合っとる場合か';
    }

    const firstPlacePoint = getPointForRank(1, participants) ?? participant.points;

    if (firstPlacePoint - participant.points === 1) {
      return '🥈 惜しかったやん';
    }

    return '🛖 ええ線いっとる';
  }

  const comparisonPoint = secondPlacePoint ?? participant.points;
  const difference = comparisonPoint - participant.points;

  if (difference === 1) {
    return '👏 今日は頑張ったやん';
  }

  if (difference === 2) {
    return '📦 資源係';
  }

  return '👀 島におった？';
}

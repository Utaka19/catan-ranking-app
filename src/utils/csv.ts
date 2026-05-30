import type { Game, Player, PlayerId } from '@/types/game';
import {
  normalizeGameRanks,
  sortGamesByNewest,
  sortParticipantsForDisplay,
} from '@/utils/ranking';

function getPlayerName(players: readonly Player[], playerId: PlayerId) {
  return players.find((player) => player.id === playerId)?.name ?? playerId;
}

function escapeCsvValue(value: string | number) {
  const text = String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function exportGamesToCsv(games: readonly Game[], players: readonly Player[]) {
  const rows = ['gameId,date,rank,playerId,playerName,point'];
  const sortedGames = sortGamesByNewest(games).reverse();

  for (const game of sortedGames) {
    const participants = sortParticipantsForDisplay(normalizeGameRanks(game).participants);

    for (const participant of participants) {
      rows.push(
        [
          game.id,
          game.date,
          participant.rank,
          participant.playerId,
          getPlayerName(players, participant.playerId),
          participant.points,
        ]
          .map(escapeCsvValue)
          .join(','),
      );
    }
  }

  return rows.join('\n');
}

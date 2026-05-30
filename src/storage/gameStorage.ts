import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_PLAYERS } from '@/constants/players';
import { STORAGE_KEYS } from '@/constants/storage';
import type { Game, GameParticipant, Player, PlayerId, Players, Rank } from '@/types/game';

function isPlayerId(value: unknown): value is PlayerId {
  return value === 'me' || value === 'older-brother' || value === 'younger-brother';
}

function isRank(value: unknown): value is Rank {
  return value === 1 || value === 2 || value === 3;
}

function isGameParticipant(value: unknown): value is GameParticipant {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const participant = value as Partial<GameParticipant>;

  return (
    isPlayerId(participant.playerId) &&
    isRank(participant.rank) &&
    Number.isInteger(participant.points) &&
    typeof participant.points === 'number' &&
    participant.points >= 0
  );
}

function isGame(value: unknown): value is Game {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const game = value as Partial<Game>;

  return (
    typeof game.id === 'string' &&
    typeof game.date === 'string' &&
    typeof game.createdAt === 'number' &&
    Array.isArray(game.participants) &&
    game.participants.length === 3 &&
    game.participants.every(isGameParticipant)
  );
}

function isPlayer(value: unknown): value is Player {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const player = value as Partial<Player>;

  return isPlayerId(player.id) && typeof player.name === 'string' && player.name.trim().length > 0;
}

function normalizePlayers(value: unknown): Players {
  const savedPlayers = Array.isArray(value) ? value.filter(isPlayer) : [];

  return DEFAULT_PLAYERS.map((defaultPlayer) => {
    const savedPlayer = savedPlayers.find((player) => player.id === defaultPlayer.id);
    return {
      id: defaultPlayer.id,
      name: savedPlayer?.name.trim() || defaultPlayer.name,
    };
  }) as Players;
}

export async function loadGames() {
  const rawGames = await AsyncStorage.getItem(STORAGE_KEYS.games);

  if (!rawGames) {
    return [];
  }

  try {
    const parsedGames: unknown = JSON.parse(rawGames);
    return Array.isArray(parsedGames) ? parsedGames.filter(isGame) : [];
  } catch {
    return [];
  }
}

export async function saveGames(games: readonly Game[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.games, JSON.stringify(games));
}

export async function loadPlayers() {
  const rawPlayers = await AsyncStorage.getItem(STORAGE_KEYS.players);

  if (!rawPlayers) {
    const defaultPlayers = normalizePlayers(DEFAULT_PLAYERS);
    await savePlayers(defaultPlayers);
    return defaultPlayers;
  }

  try {
    return normalizePlayers(JSON.parse(rawPlayers));
  } catch {
    return normalizePlayers(DEFAULT_PLAYERS);
  }
}

export async function savePlayers(players: readonly Player[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.players, JSON.stringify(players));
}

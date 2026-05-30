import type { Player } from '@/types/game';

export const DEFAULT_PLAYERS = [
  { id: 'me', name: '開拓者1' },
  { id: 'older-brother', name: '開拓者2' },
  { id: 'younger-brother', name: '開拓者3' },
] as const satisfies readonly Player[];

export const PLAYER_IDS = DEFAULT_PLAYERS.map((player) => player.id);

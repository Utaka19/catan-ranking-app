import { PLAYER_IDS } from '@/constants/players';
import type { GameInput, PlayerId } from '@/types/game';
import { isValidDateString } from '@/utils/date';

export function validateGameInput(input: GameInput) {
  const errors: string[] = [];

  if (!input.date.trim()) {
    errors.push('試合日を入力してください。');
  } else if (!isValidDateString(input.date)) {
    errors.push('試合日は YYYY-MM-DD 形式の実在する日付で入力してください。');
  }

  const selectedPlayers = input.participants.map((participant) => participant.playerId);
  const uniquePlayers = new Set<PlayerId>(selectedPlayers);

  if (selectedPlayers.length !== PLAYER_IDS.length) {
    errors.push('3人分のポイントを入力してください。');
  }

  if (uniquePlayers.size !== selectedPlayers.length) {
    errors.push('同じ開拓者を複数登録できません。');
  }

  for (const playerId of selectedPlayers) {
    if (!PLAYER_IDS.includes(playerId)) {
      errors.push('固定プレイヤー以外は登録できません。');
      break;
    }
  }

  for (const participant of input.participants) {
    if (!Number.isInteger(participant.points) || participant.points < 0) {
      errors.push('ポイントは0以上の整数で入力してください。');
      break;
    }
  }

  return errors;
}

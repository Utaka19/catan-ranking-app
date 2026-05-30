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

  if (uniquePlayers.size !== selectedPlayers.length) {
    errors.push('同じプレイヤーを複数の順位に選べません。');
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

  const sortedParticipants = [...input.participants].sort((left, right) => left.rank - right.rank);
  const [first, second, third] = sortedParticipants;

  if (first.points < second.points || second.points < third.points) {
    errors.push(
      '順位とポイントが一致していません。1位 >= 2位 >= 3位 になるように入力してください。',
    );
  }

  return errors;
}

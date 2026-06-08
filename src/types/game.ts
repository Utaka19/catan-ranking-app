export type PlayerId = 'me' | 'older-brother' | 'younger-brother';

export type Player = {
  id: PlayerId;
  name: string;
};

export type Players = [Player, Player, Player];

export type Rank = 1 | 2 | 3;

export type GameParticipant = {
  playerId: PlayerId;
  rank: Rank;
  points: number;
};

export type Game = {
  id: string;
  date: string;
  participants: [GameParticipant, GameParticipant, GameParticipant];
  createdAt: number;
};

export type GameInput = {
  date: string;
  participants: [GameParticipant, GameParticipant, GameParticipant];
};

export type RankingRow = {
  displayRank: number;
  playerId: PlayerId;
  playerName: string;
  firstPlaces: number;
  secondPlaces: number;
  thirdPlaces: number;
  overallScore: number;
  totalPoints: number;
};

export type PeriodPreset = 'all' | 'thisMonth' | 'lastMonth' | 'custom';

export type PeriodSelection = {
  preset: PeriodPreset;
  startDate: string;
  endDate: string;
};

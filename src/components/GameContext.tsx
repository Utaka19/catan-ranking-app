import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { DEFAULT_PLAYERS } from '@/constants/players';
import {
  clearStoredGames,
  deleteStoredGame,
  loadGames,
  loadPlayers,
  saveGames,
  savePlayers,
  updateStoredGame,
} from '@/storage/gameStorage';
import type { Game, GameInput, Player, PlayerId, Players } from '@/types/game';
import { validateGameInput } from '@/utils/validation';

type GameContextValue = {
  games: Game[];
  players: Players;
  isLoading: boolean;
  errorMessage: string | null;
  addGame: (input: GameInput) => Promise<{ ok: true } | { ok: false; errors: string[] }>;
  updateGame: (game: Game) => Promise<{ ok: true } | { ok: false; errors: string[] }>;
  deleteGame: (gameId: string) => Promise<void>;
  clearGames: () => Promise<void>;
  updatePlayerName: (
    playerId: PlayerId,
    name: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
};

const GameContext = createContext<GameContextValue | null>(null);

function createGame(input: GameInput): Game {
  const createdAt = Date.now();

  return {
    ...input,
    id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Players>([...DEFAULT_PLAYERS] as Players);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([loadGames(), loadPlayers()])
      .then(([loadedGames, loadedPlayers]) => {
        if (isMounted) {
          setGames(loadedGames);
          setPlayers(loadedPlayers);
        }
      })
      .catch(() => {
        if (isMounted) {
          setErrorMessage('保存済みデータの読み込みに失敗しました。');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addGame = useCallback(async (input: GameInput) => {
    const errors = validateGameInput(input);

    if (errors.length > 0) {
      return { ok: false, errors } as const;
    }

    const nextGames = [createGame(input), ...games];
    await saveGames(nextGames);
    setGames(nextGames);
    setErrorMessage(null);

    return { ok: true } as const;
  }, [games]);

  const updateGame = useCallback(async (game: Game) => {
    const errors = validateGameInput(game);

    if (errors.length > 0) {
      return { ok: false, errors } as const;
    }

    const nextGames = await updateStoredGame(game);
    setGames(nextGames);
    setErrorMessage(null);

    return { ok: true } as const;
  }, []);

  const deleteGame = useCallback(async (gameId: string) => {
    const nextGames = await deleteStoredGame(gameId);
    setGames(nextGames);
    setErrorMessage(null);
  }, []);

  const clearGames = useCallback(async () => {
    await clearStoredGames();
    setGames([]);
    setErrorMessage(null);
  }, []);

  const updatePlayerName = useCallback(async (playerId: PlayerId, name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { ok: false, error: '名前は空にできません。' } as const;
    }

    const nextPlayers = players.map<Player>((player) =>
      player.id === playerId ? { ...player, name: trimmedName } : player,
    ) as Players;

    await savePlayers(nextPlayers);
    setPlayers(nextPlayers);
    setErrorMessage(null);

    return { ok: true } as const;
  }, [players]);

  const value = useMemo(
    () => ({
      games,
      players,
      isLoading,
      errorMessage,
      addGame,
      updateGame,
      deleteGame,
      clearGames,
      updatePlayerName,
    }),
    [addGame, clearGames, deleteGame, errorMessage, games, isLoading, players, updateGame, updatePlayerName],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGames() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGames must be used within GameProvider');
  }

  return context;
}

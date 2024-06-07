const GAME_STATE = {
  SETUP: 'setup',
  IN_PROGRESS: 'in-progress',
  GAME_OVER: 'game-over',
  WIN: 'win',
} as const;

export type GameState = ObjectValues<typeof GAME_STATE>;

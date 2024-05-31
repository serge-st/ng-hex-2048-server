const GAME_STATE = {
  SETUP: 'setup',
  IN_PROGRESS: 'in-progress',
  GAME_OVER: 'game-over',
  WIN: 'win',
} as const;

export type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];

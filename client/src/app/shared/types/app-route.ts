const APP_ROUTE = {
  GAME: 'game',
  GAME_SETUP: 'game-setup',
  NOT_FOUND: '**',
} as const;

export type AppRoute = (typeof APP_ROUTE)[keyof typeof APP_ROUTE];

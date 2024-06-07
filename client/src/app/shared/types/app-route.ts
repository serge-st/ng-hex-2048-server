const APP_ROUTE = {
  GAME: 'game',
  GAME_SETUP: 'game-setup',
  NOT_FOUND: '**',
  // TODO: remove after testing
  TEST_CONTROL: 'test-control',
} as const;

export type AppRoute = ObjectValues<typeof APP_ROUTE>;

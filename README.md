<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Hexagonal 2048 Backed Game Server

### Description:

Initially, the idea was taken from the Evolution TypeScript bootcamp task.

Massive thanks to **Amit Patel** from **Red Blob Games** for creating this [amazing article](https://www.redblobgames.com/grids/hexagons/) that helped a ton!

In this repo, you will find a game engine for the web-based hexagonal version of the popular 2048 game, written using Nest.js

In the beginning, I developed the app [here](https://github.com/serge-st/ng-hex-2048), but later on, I decided to move it to a separate repository.

### Installation:

```bash
pnpm install --frozen-lockfile
```

### Running the app:

```bash
# development watch mode
pnpm start:dev

# production mode
pnpm build && pnpm start:prod
```

### Additional information:

The app has one main endpoint, which handles the generation of new hexagon tiles for the game to move one. The idea is that the client app, after every user's move, calls the backend server, provides the current tiles, and receives the new tiles which are added to the grid after each successful move.

You must provide a hexagon grid `radius` as a `parameter` to the `hex-grid-management` endpoint. Radius 1 means that your grid has 7 hexagons in total, one in the center and one on each side of that central hexagon.

To get the initial hexagon tiles you can simply test this service by calling:

```bash
curl -X POST http://localhost:3000/hex-grid-management/1 \
-H "Content-Type: application/json" \
-d '[]'
```

After a move is made, and the client has some hexagon tiles on the grid, you can call the service again providing the mentioned tiles to get new hexagon tiles for the next move:

```bash
curl -X POST http://localhost:3000/hex-grid-management/1 \
-H "Content-Type: application/json" \
-d '[{"q": 1, "r": -1, "s": 0, "value": 4}, {"q": -1, "r": 0, "s": 1, "value": 2}]'
```

When you provide some JSON data to the endpoint, custom `ParseArrayPipe` is executed to validate the data, first according to the `hex-data.dto.ts` and then to check that each hexagon's coordinates are valid (in hexagonal grids a hexagon has 3 coordinates, and the sum of the coordinates must equal 0).

If the validation succeeds, the service checks what tiles for the provided radius are available, and then uses some of the empty tiles to generate new hexagons with values, according to the difficulty settings. The response will be something like this:

```json
[{ "q": 0, "r": -1, "s": 1, "value": 4 }]
```

or this (based on the radius the new hexagon count can be from 1 to 4 and hexagon values will be either 2 or 4):

```json
[
  { "q": 0, "r": 0, "s": 0, "value": 2 },
  { "q": 0, "r": -1, "s": 1, "value": 2 }
]
```

As the hexagonal version of the original "squared" 2048 game is much easier, I added some additional difficulty progression, that makes the game more challenging on bigger radiuses.

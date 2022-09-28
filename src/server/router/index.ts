// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { pokemonsRouter } from "./pokemons";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("pokemons.", pokemonsRouter)

// export type definition of API
export type AppRouter = typeof appRouter;

import { createRouter } from "./context";
import { z } from "zod";

import { PokemonClient } from "pokenode-ts";

export const pokemonsRouter = createRouter().query("get-pokemon", {
  input: z.object({
    id: z.number(),
  }),
  async resolve({ input }) {
    const api = new PokemonClient();
    const pokemon = await api.getPokemonById(input.id);
    return { name: pokemon.name, sprites: pokemon.sprites };
  },
});
import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";
import { TRPCError } from "@trpc/server";

export const pokemonsRouter = createRouter()
  .query("get-pokemon", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const pokemon = await prisma.pokemon.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!pokemon) {
        throw new TRPCError({
          message: "Pokemon doesn't exist",
          code: "NOT_FOUND",
        });
      }

      return pokemon;
    },
  })
  .mutation("cast-vote", {
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve({ input }) {
      const voteInDb = await prisma.vote.create({
        data: {
          ...input,
        },
      });
      return { success: true, vote: voteInDb };
    },
  });

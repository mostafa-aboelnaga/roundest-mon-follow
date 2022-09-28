import { getOptionsForVote } from "@/utils/getRandomPokemon";
import type { NextPage } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["pokemons.get-pokemon", { id: first! }]);
  const secondPokemon = trpc.useQuery([
    "pokemons.get-pokemon",
    { id: second! },
  ]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex items-center justify-between max-w-2xl">
        <div className="w-64 h-64 flex flex-col justify-center items-center">
          <img
            className="w-full"
            src={firstPokemon.data?.sprites.front_default!}
            alt=" "
          />
          <div className="text-xl capitalize mt-[-2rem]">{firstPokemon.data?.name}</div>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64 flex flex-col justify-center items-center">
          <img
            className="w-full"
            src={secondPokemon.data?.sprites.front_default!}
            alt=" "
          />
          <div className="text-xl capitalize mt-[-2rem]">{secondPokemon.data?.name}</div>
        </div>
        <div className="p-3" />
      </div>
    </div>
  );
};

export default Home;

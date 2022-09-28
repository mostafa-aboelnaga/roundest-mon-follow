import { getOptionsForVote } from "@/utils/getRandomPokemon";
import type { NextPage } from "next";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import Image from "next/image";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["pokemons.get-pokemon", { id: first! }]);
  const secondPokemon = trpc.useQuery([
    "pokemons.get-pokemon",
    { id: second! },
  ]);

  const voteMutation = trpc.useMutation(["pokemons.cast-vote"]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first!, votedAgainst: second! });
    } else {
      voteMutation.mutate({ votedFor: second!, votedAgainst: first! });
    }
    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex items-center justify-between max-w-2xl">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <PokemonListing
              pokemon={firstPokemon.data}
              vote={() => voteForRoundest(first!)}
            />
          )}
        <div className="p-8">Vs</div>
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <PokemonListing
              pokemon={secondPokemon.data}
              vote={() => voteForRoundest(second!)}
            />
          )}

        <div className="p-3" />
      </div>
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<"pokemons.get-pokemon">;
const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        width={256}
        height={256}
        layout="fixed"
        src={props.pokemon.spriteUrl}
        alt={props.pokemon.name}
      />
      <div className="text-xl capitalize mt-[-2rem]">{props.pokemon.name}</div>
      <button
        className="text-black inline-flex items-center justify-center rounded-md bg-white p-2 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={() => props.vote()}
      >
        Rounder
      </button>
    </div>
  );
};

export default Home;

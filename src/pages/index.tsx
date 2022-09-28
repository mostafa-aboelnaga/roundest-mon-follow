import { getOptionsForVote } from "@/utils/getRandomPokemon";
import type { NextPage } from "next";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["pokemons.get-pokemon", { id: first! }]);
  const secondPokemon = trpc.useQuery([
    "pokemons.get-pokemon",
    { id: second! },
  ]);

  const voteMutation = trpc.useMutation(["pokemons.cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first!, votedAgainst: second! });
    } else {
      voteMutation.mutate({ votedFor: second!, votedAgainst: first! });
    }
    updateIds(getOptionsForVote());
  };

  // const dataLoaded = false;
  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center p-32">
      <div className="text-2xl text-center">Which Pokémon is Rounder?</div>
      {dataLoaded && (
        <div className="rounded m-0 p-8 flex items-center justify-center max-w-2xl">
          <PokemonListing
            pokemon={firstPokemon.data!}
            vote={() => voteForRoundest(first!)}
          />
          <div className="p-8">VS</div>
          <PokemonListing
            pokemon={secondPokemon.data!}
            vote={() => voteForRoundest(second!)}
          />
          <div className="p-3" />
        </div>
      )}
      {!dataLoaded && <img src="/puff.svg" className="w-64 h-64" />}

      <div className="w-full text-xl text-center p-8">
        <Link href="/results">
          <a>Check the results</a>
        </Link>
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
    <div className="py-8 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center mt-[-64px]">
        <Image
          width={256}
          height={256}
          layout="fixed"
          src={props.pokemon.spriteUrl}
          alt={props.pokemon.name}
        />
        <div className="text-xl capitalize mt-[-2rem]">
          {props.pokemon.name}
        </div>
      </div>
      <button
        className="text-black inline-flex mt-7 items-center justify-center rounded-md bg-white p-2 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={() => props.vote()}
      >
        ROUNDER
      </button>
    </div>
  );
};

export default Home;

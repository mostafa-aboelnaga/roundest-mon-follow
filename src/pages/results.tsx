import type { GetServerSideProps } from "next";
import { prisma } from "@/server/db/client";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      votesFor: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votesFor: true,
          votesAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
  props,
) => {
  return (
    <div className="flex border p-2 items-center ">
      <Image
        src={props.pokemon.spriteUrl}
        width={64}
        height={64}
        layout="fixed"
      />
      <div className="capitalize">{props.pokemon.name}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl p-8">Results!</h2>
      <div className="flex flex-col w-full max-w-2xl">
        {props.pokemon.map((currentPokemon, index) => {
          return <PokemonListing key={index} pokemon={currentPokemon} />;
        })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();
  return { props: { pokemon: pokemonOrdered }, revalidate: 60 };
};

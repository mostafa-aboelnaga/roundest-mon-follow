import type { GetServerSideProps } from "next";
import { prisma } from "@/server/db/client";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";
import Link from "next/link";

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

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const { votesFor, votesAgainst } = pokemon._count;
  if (votesFor + votesAgainst === 0) {
    return 0;
  }
  return (votesFor / (votesFor + votesAgainst)) * 100;
};

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = ({
  pokemon,
}) => {
  return (
    <div className="flex border p-2 items-center justify-between hover:cursor-pointer bg-inherit hover:bg-slate-500">
      <div className="flex items-center">
        <Image src={pokemon.spriteUrl} width={64} height={64} layout="fixed" />
        <div className="capitalize">{pokemon.name}</div>
      </div>
      <div className="pr-4">{generateCountPercent(pokemon) + "%"}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: PokemonQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex py-8 px-0 w-full max-w-2xl items-center justify-between">
        <h2 className="text-3xl">Results</h2>
        <div className="text-lg">
          <Link href="/">
            <a>← Home</a>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-2xl">
        {props.pokemon
          .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
          .map((currentPokemon, index) => {
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

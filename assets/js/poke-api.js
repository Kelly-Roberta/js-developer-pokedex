const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    return pokemon;
}

pokeApi.getPokemonDetail = async (pokemon) => {
    try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
            throw new Error(`Erro ao obter detalhes do Pokémon: ${response.status}`);
        }
        const pokeDetail = await response.json();
        return convertPokeApiDetailToPokemon(pokeDetail);
    } catch (error) {
        console.error("Erro ao obter detalhes do Pokémon:", error);
        throw error;
    }
};

pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    try {
        const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao obter lista de Pokémon: ${response.status}`);
        }
        const jsonBody = await response.json();
        const pokemons = jsonBody.results;
        const detailRequests = pokemons.map(async (pokemon) => {
            const pokemonDetail = await pokeApi.getPokemonDetail(pokemon);
            return pokemonDetail;
        });
        return await Promise.all(detailRequests);
    } catch (error) {
        console.error("Erro ao obter lista de Pokémon:", error);
        throw error;
    }
};

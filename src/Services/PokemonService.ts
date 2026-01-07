import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../Entities/Pokemon';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  async findAllPokemons(): Promise<Pokemon[]> {
    return this.pokemonRepository.find({ order: { pokedexNumber: 'ASC' } });
  }
  async findPokemonById(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });
    if (!pokemon) throw new NotFoundException(`No se encontró Pokémon con nombre "${name}"`);
    return pokemon; 

  }

  async findPokemonByName(name: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({ where: { name } });
    if (!pokemon) throw new NotFoundException(`No se encontró Pokémon con nombre "${name}"`);
    return pokemon;
  }

  async findPokemonsByTypes(types: string[]): Promise<Pokemon[]> {
    if (!types || types.length === 0) throw new BadRequestException('Debe indicar al menos un tipo');

    const pokemons = await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .where(
        types.map((_, index) => `pokemon.types LIKE :type${index}`).join(' OR ')
      )
      .setParameters(
        types.reduce((params, type, index) => {
          params[`type${index}`] = `%${type}%`;
          return params;
        }, {})
      )
      .getMany();

    if (pokemons.length === 0)
      throw new NotFoundException(`No se encontraron Pokémon con los tipos indicados: ${types.join(', ')}`);

    return pokemons;
  }

  async findPokemonsByBothTypes(types: string[]): Promise<Pokemon[]> {
    if (!types || types.length === 0) throw new BadRequestException('Debe indicar al menos un tipo');

    const pokemons = await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .where(
        types.map((_, index) => `pokemon.types LIKE :type${index}`).join(' AND ')
      )
      .setParameters(
        types.reduce((params, type, index) => {
          params[`type${index}`] = `%${type}%`;
          return params;
        }, {})
      )
      .getMany();

    if (pokemons.length === 0)
      throw new NotFoundException(`No se encontraron Pokémon que tengan exactamente todos los tipos: ${types.join(', ')}`);

    return pokemons;
  }

  async findPokemonsByGeneration(generation: number): Promise<Pokemon[]> {
    if (generation < 1 || generation > 9)
      throw new BadRequestException('La generación debe estar entre 1 y 9');

    return this.pokemonRepository.find({
      where: { generation },
      order: { pokedexNumber: 'ASC' },
    });
  }

  async findLegendaryPokemons(): Promise<Pokemon[]> {
    return this.pokemonRepository.find({
      where: { isLegendary: true },
      order: { generation: 'ASC' },
    });
  }

  async findPokemonsByTypeAndGeneration(types: string[], generation: number): Promise<Pokemon[]> {
    if (generation < 1 || generation > 9)
      throw new BadRequestException('La generación debe estar entre 1 y 9');
    if (!types || types.length === 0) throw new BadRequestException('Debe indicar al menos un tipo');

    return this.pokemonRepository
      .createQueryBuilder('pokemon')
      .where(
        types.map((_, index) => `pokemon.types LIKE :type${index}`).join(' OR ')
      )
      .setParameters(
        types.reduce((params, type, index) => {
          params[`type${index}`] = `%${type}%`;
          return params;
        }, {})
      )
      .andWhere('pokemon.generation = :generation', { generation })
      .getMany();
  }

  async findPokemonsByBothTypeAndGeneration(types: string[], generation: number): Promise<Pokemon[]> {
    if (generation < 1 || generation > 9)
      throw new BadRequestException('La generación debe estar entre 1 y 9');
    if (!types || types.length === 0) throw new BadRequestException('Debe indicar al menos un tipo');

    const pokemons = await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .where(
        types.map((_, index) => `pokemon.types LIKE :type${index}`).join(' AND ')
      )
      .setParameters(
        types.reduce((params, type, index) => {
          params[`type${index}`] = `%${type}%`;
          return params;
        }, {})
      )
      .andWhere('pokemon.generation = :generation', { generation })
      .getMany();

    if (pokemons.length === 0)
      throw new NotFoundException(`No se encontraron Pokémon con los tipos ${types.join(', ')} y generación ${generation}`);

    return pokemons;
  }

  async findLegendaryPokemonsByGeneration(generation: number): Promise<Pokemon[]> {
    if (generation < 1 || generation > 9)
      throw new BadRequestException('La generación debe estar entre 1 y 9');
    return this.pokemonRepository.find({ where: { isLegendary: true, generation } });
  }

  async findPokemonsByTypeAndLegendary(types: string[]): Promise<Pokemon[]> {
    if (!types || types.length === 0) throw new BadRequestException('Debe indicar al menos un tipo');

    const pokemons = await this.pokemonRepository
      .createQueryBuilder('pokemon')
      .where(
        types.map((_, index) => `pokemon.types LIKE :type${index}`).join(' AND ')
      )
      .setParameters(
        types.reduce((params, type, index) => {
          params[`type${index}`] = `%${type}%`;
          return params;
        }, {})
      )
      .andWhere('pokemon.isLegendary = :isLegendary', { isLegendary: true })
      .getMany();

    if (pokemons.length === 0)
      throw new NotFoundException(`No se encontraron Pokémon legendarios con los tipos: ${types.join(', ')}`);

    return pokemons;
  }

  async findPokemonsByPokedexNumber(pokedexNumber: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({ where: { pokedexNumber } });
    if (!pokemon) throw new NotFoundException(`No se encontró Pokémon con número de Pokédex ${pokedexNumber}`);
    return pokemon;
  }

  async findPokemonsWithEmptyBuilds(): Promise<string[]> {
  const allPokemons = await this.pokemonRepository.find({
    relations: ['builds'],
  });

  const withoutBuilds = allPokemons
    .filter(p => !p.builds || p.builds.length === 0)
    .map(p => p.name);

    return withoutBuilds;
  }

  async exportarPokemosFormatoJSON(): Promise<Pokemon[]> {
    return this.pokemonRepository.find({ order: { pokedexNumber: 'ASC' } });
    
  }




  
}

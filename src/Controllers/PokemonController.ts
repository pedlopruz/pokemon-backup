import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PokemonService } from '../Services/PokemonService';
import { Pokemon } from '../Entities/Pokemon';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async getAllPokemons(): Promise<Pokemon[]> {
    return this.pokemonService.findAllPokemons();
  }

  @Get('id/:id')
  async getPokemonById(@Param('id') id: number): Promise<Pokemon> {
    return this.pokemonService.findPokemonById(id);
  }



  @Get('name/:name')
  async getPokemonByName(@Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.findPokemonByName(name);
  }

  @Get('types/:types')
  async getPokemonsByType(@Param('types') types: string): Promise<Pokemon[]> {
    const typesArray = types.split(',');
    return this.pokemonService.findPokemonsByTypes(typesArray);
  }

  @Get('types-both/:types')
  async getPokemonsByBothTypes(@Param('types') types: string): Promise<Pokemon[]> {
    const typesArray = types.split(',');
    return this.pokemonService.findPokemonsByBothTypes(typesArray);
  }

  @Get('legendary')
  async getLegendaryPokemons(): Promise<Pokemon[]> {
    return this.pokemonService.findLegendaryPokemons();
  }

  @Get('generation/:generation')
  async getPokemonsByGeneration(
    @Param('generation', ParseIntPipe) generation: number,
  ): Promise<Pokemon[]> {
    return this.pokemonService.findPokemonsByGeneration(generation);
  }

  @Get('types/:types/generation/:generation')
  async getPokemonsByTypeAndGeneration(
    @Param('types') types: string,
    @Param('generation', ParseIntPipe) generation: number,
  ): Promise<Pokemon[]> {
    const typesArray = types.split(',');
    return this.pokemonService.findPokemonsByTypeAndGeneration(typesArray, generation);
  }

  @Get('types-both/:types/generation/:generation')
  async getPokemonsByBothTypeAndGeneration(
    @Param('types') types: string,
    @Param('generation', ParseIntPipe) generation: number,
  ): Promise<Pokemon[]> {
    const typesArray = types.split(',');
    return this.pokemonService.findPokemonsByBothTypeAndGeneration(typesArray, generation);
  }

  @Get('legendary/generation/:generation')
  async getLegendaryPokemonsByGeneration(
    @Param('generation', ParseIntPipe) generation: number,
  ): Promise<Pokemon[]> {
    return this.pokemonService.findLegendaryPokemonsByGeneration(generation);
  }

  @Get('legendary/types/:types')
  async getPokemonsByTypeAndLegendary(
    @Param('types') types: string,
  ): Promise<Pokemon[]> {
    const typesArray = types.split(',');
    return this.pokemonService.findPokemonsByTypeAndLegendary(typesArray);
  }

  @Get('pokedex/:pokedexNumber')
  async getPokemonByPokedexNumber(
    @Param('pokedexNumber', ParseIntPipe) pokedexNumber: number,
  ): Promise<Pokemon> {
    return this.pokemonService.findPokemonsByPokedexNumber(pokedexNumber);
  }

  @Get('empty-builds')
  async getEmptyBuilds() {
    return this.pokemonService.findPokemonsWithEmptyBuilds();
  }

}

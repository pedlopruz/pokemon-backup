// Controller PokeApiService

import { Controller, Post, Body } from '@nestjs/common';
import { PokeApiService } from '../Services/PokeApiService';
import { Pokemon } from '../Entities/Pokemon';

@Controller('pokeapi')
export class PokeApiController {
    constructor(private readonly pokeApiService: PokeApiService) {}
  @Post('fetch-all')
  async fetchAllPokemon() {
    return this.pokeApiService.fetchAndStoreAllPokemon();
  }
}
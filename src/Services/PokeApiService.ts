import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../Entities/Pokemon';
import axios from 'axios';
import { SmogonService } from './SmogonService';

@Injectable()
export class PokeApiService {
  private readonly BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
  private readonly SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species/';

  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    private readonly smogonService: SmogonService, // <-- inyectamos SmogonService
  ) {}

  // Método optimizado para traer los 1025 Pokémon en batches
  async fetchAndStoreAllPokemon(): Promise<Pokemon[]> {
    const savedPokemon: Pokemon[] = [];
    const batchSize = 50;

    const existingCount = await this.pokemonRepository.count();
    if (existingCount > 0) {
      console.log(`Encontrados ${existingCount} Pokémon en la BD. Eliminando...`);
      await this.pokemonRepository.clear();
      console.log("Base de datos limpiada.");
    }

    const allIds = Array.from({ length: 1025 }, (_, i) => i + 1);

    for (let i = 0; i < allIds.length; i += batchSize) {
      const batchIds = allIds.slice(i, i + batchSize);

      const batchPromises = batchIds.map(async (id) => {
        try {
          const [pokemonResponse, speciesResponse] = await Promise.all([
            axios.get(`${this.BASE_URL}${id}`),
            axios.get(`${this.SPECIES_URL}${id}`),
          ]);

          const pokemonData = pokemonResponse.data;
          const speciesData = speciesResponse.data;

          const pokemon = this.pokemonRepository.create({
            pokedexNumber: speciesData.pokedex_numbers.find(
              (p: any) => p.pokedex.name === 'national'
            )?.entry_number,
            name: pokemonData.name,
            types: pokemonData.types.map((t: any) => t.type.name),
            generation: parseInt(
              speciesData.generation.url.split("/").slice(-2, -1)[0]
            ),
            isLegendary: speciesData.is_legendary,
            spriteUrl: pokemonData.sprites.front_default,
          });

          await this.pokemonRepository.save(pokemon);
          savedPokemon.push(pokemon);

          console.log(`Saved Pokémon ${id}: ${pokemon.name}`);

          // Llamada a SmogonService
          try {
            const builds = await this.smogonService.fetchAndSaveBuilds(pokemon);
            console.log(`Guardadas ${builds.length} builds para ${pokemon.name}`);
          } catch (buildErr) {
            console.error(`Error guardando builds de ${pokemon.name}:`, buildErr.message);
          }

        } catch (error) {
          console.error(`Error fetching Pokémon ${id}:`, error.message);
        }
      });

      await Promise.all(batchPromises);
    }

    return savedPokemon;
  }
}

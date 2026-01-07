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
  private readonly TYPE_URL = 'https://pokeapi.co/api/v2/type/';

  private readonly ALL_TYPES = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    private readonly smogonService: SmogonService,
  ) {}

  // =============================
  // EFECTIVIDAD DE TIPOS
  // =============================
  private async calculateTypeEffectiveness(
    types: string[]
  ): Promise<Record<string, number>> {
    const effectiveness: Record<string, number> = {};

    for (const type of types) {
      const typeData = (await axios.get(
        `${this.TYPE_URL}${type}`
      )).data;

      typeData.damage_relations.double_damage_from.forEach((t: any) => {
        effectiveness[t.name] = (effectiveness[t.name] ?? 1) * 2;
      });

      typeData.damage_relations.half_damage_from.forEach((t: any) => {
        effectiveness[t.name] = (effectiveness[t.name] ?? 1) * 0.5;
      });

      typeData.damage_relations.no_damage_from.forEach((t: any) => {
        effectiveness[t.name] = 0;
      });
    }

    for (const type of this.ALL_TYPES) {
      if (!(type in effectiveness)) {
        effectiveness[type] = 1;
      }
    }

    return effectiveness;
  }

  // =============================
  // FETCH MASIVO (INCLUYE FORMAS)
  // =============================
  async fetchAndStoreAllPokemon(): Promise<Pokemon[]> {
    const savedPokemon: Pokemon[] = [];
    const batchSize = 50;

    const existingCount = await this.pokemonRepository.count();
    if (existingCount > 0) {
      console.log(`BD ya poblada con ${existingCount} Pokémon. No hago nada.`);
      return [];
    }

    console.log('BD vacía. Iniciando carga completa de Pokémon...');

    const allIds = Array.from({ length: 1025 }, (_, i) => i + 1);

    for (let i = 0; i < allIds.length; i += batchSize) {
      const batchIds = allIds.slice(i, i + batchSize);

      const batchPromises = batchIds.map(async (id) => {
        try {
          const speciesResponse = await axios.get(
            `${this.SPECIES_URL}${id}`
          );

          const speciesData = speciesResponse.data;

          // 🔹 Iteramos TODAS las variedades (formas)
          for (const variety of speciesData.varieties) {
            try {
              const pokemonResponse = await axios.get(
                variety.pokemon.url
              );

              const pokemonData = pokemonResponse.data;

              // =============================
              // STATS BASE
              // =============================
              const statsMap = pokemonData.stats.reduce(
                (acc: any, stat: any) => {
                  acc[stat.stat.name] = stat.base_stat;
                  return acc;
                },
                {}
              );

              // =============================
              // TIPOS
              // =============================
              const types = pokemonData.types.map(
                (t: any) => t.type.name
              );

              // =============================
              // EFECTIVIDAD
              // =============================
              const typeEffectiveness =
                await this.calculateTypeEffectiveness(types);

              // =============================
              // CREAR POKÉMON
              // =============================
              const pokemon = this.pokemonRepository.create({
                pokedexNumber: speciesData.pokedex_numbers.find(
                  (p: any) => p.pokedex.name === 'national'
                )?.entry_number,

                name: pokemonData.name, // ponyta-galar
                types,
                generation: parseInt(
                  speciesData.generation.url
                    .split('/')
                    .slice(-2, -1)[0]
                ),
                isLegendary: speciesData.is_legendary,
                spriteUrl: pokemonData.sprites.front_default,

                // Stats
                hp: statsMap.hp,
                attack: statsMap.attack,
                defense: statsMap.defense,
                specialAttack: statsMap['special-attack'],
                specialDefense: statsMap['special-defense'],
                speed: statsMap.speed,

                typeEffectiveness,

              });

              await this.pokemonRepository.save(pokemon);
              savedPokemon.push(pokemon);

              console.log(
                `Saved Pokémon: ${pokemon.name} (base: ${speciesData.name})`
              );

              // =============================
              // SMOGON BUILDS
              // =============================
              try {
                const builds =
                  await this.smogonService.fetchAndSaveBuilds(pokemon);

                console.log(
                  `Guardadas ${builds.length} builds para ${pokemon.name}`
                );
                
              } catch (buildErr) {
                console.error(
                  `Error guardando builds de ${pokemon.name}:`,
                  buildErr.message
                );
              }
            } catch (varietyErr) {
              console.error(
                `Error fetching variety ${variety.pokemon.name}:`,
                varietyErr.message
              );
            }
          }
        } catch (error) {
          console.error(`Error fetching species ${id}:`, error.message);
        }
      });

      await Promise.all(batchPromises);
    }
    // ✅ SOLO AQUÍ
    console.log('Reasignando builds de Mega Pokémon...');
    await this.smogonService.reassignMegaBuilds();
    console.log('Reasignación de Megas completada ✅');

    return savedPokemon;
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './Entities/Pokemon';
import { PokeApiService } from './Services/PokeApiService';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepo: Repository<Pokemon>,
    private readonly pokeApiService: PokeApiService,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.pokemonRepo.count();

      if (count === 0) {
        console.log("➡️ BD vacía. Poblando por primera vez...");
        await this.pokeApiService.fetchAndStoreAllPokemon();
        console.log("✔️ BD poblada correctamente.");
      } else {
        console.log(`➡️ BD ya contiene ${count} Pokémon. No se hace nada.`);
      }
    } catch (err) {
      console.error("❌ Error en onModuleInit:", err.message);
    }
  }
}

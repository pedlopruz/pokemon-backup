import { Injectable } from '@nestjs/common';
import { Smogon } from '@pkmn/smogon';
import { Dex } from '@pkmn/dex';
import { Generations } from '@pkmn/data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../Entities/Pokemon';
import { PokemonBuild } from '../Entities/PokemonBuild';

@Injectable()
export class SmogonService {
  private smogon: Smogon;
  private gens: Generations;

  constructor(
    @InjectRepository(PokemonBuild)
    private readonly buildRepo: Repository<PokemonBuild>,
  ) {
    this.smogon = new Smogon(globalThis.fetch);
    this.gens = new Generations(Dex);
  }

  /**
   * Obtiene los builds de un Pokémon y los guarda en la base de datos
   * @param pokemon Instancia de Pokemon
   * @returns Lista de builds guardadas
   */
  async fetchAndSaveBuilds(pokemon: Pokemon): Promise<PokemonBuild[]> {
    const gen = this.gens.get(9); // generación 9
    const sets = await this.smogon.sets(gen, pokemon.name);

    if (!sets || sets.length === 0) return [];

    // Eliminar builds antiguas
    await this.buildRepo.delete({ pokemon: { id: pokemon.id } });

    const savedBuilds: PokemonBuild[] = [];

    for (const set of sets) {
      const buildText = this.toBuildText(pokemon.name, set);

      const build = this.buildRepo.create({
        pokemon,
        buildText,
      });

      await this.buildRepo.save(build);
      savedBuilds.push(build);
    }

    return savedBuilds;
  }

  /**
   * Convierte un set en el formato de texto requerido
   */
  private toBuildText(name: string, set: any): string {
    const evs = set.evs || {};
    const ivs = set.ivs || {};
    const moves = set.moves || [];

    const stat = (abbr: string, value?: number) =>
      value !== undefined ? `${value} ${abbr}` : null;

    const evLine = [
      stat('HP', evs.hp),
      stat('Atk', evs.atk),
      stat('Def', evs.def),
      stat('SpA', evs.spa),
      stat('SpD', evs.spd),
      stat('Spe', evs.spe),
    ].filter(Boolean).join(' / ');

    const ivLine = [
      stat('HP', ivs.hp),
      stat('Atk', ivs.atk),
      stat('Def', ivs.def),
      stat('SpA', ivs.spa),
      stat('SpD', ivs.spd),
      stat('Spe', ivs.spe),
    ].filter(Boolean).join(' / ');

    return `
${name} @ ${set.item || '—'}
Ability: ${set.ability || '—'}
EVs: ${evLine || '—'}
IVs: ${ivLine || '—'}
Tera Type: ${set.teraType || '—'}
${set.nature || '—'} Nature
Moves:
${moves.map((m: string) => ` - ${m}`).join('\n')}
`.trim();
  }
}

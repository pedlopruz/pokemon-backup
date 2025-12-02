// TeamGeneratorService.ts
import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../Entities/Pokemon';
import path from 'path';

@Injectable()
export class TeamGeneratorService {
    constructor(
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
    ) {}

    async generateRandomTeam(): Promise<Pokemon[]> {
        const teamsize = 6;
        // Contar solo pokemons que sí tienen builds
        const totalPokemons = await this.pokemonRepository
            .createQueryBuilder('pokemon')
            .leftJoin('pokemon.builds', 'builds')
            .where('builds.id IS NOT NULL')
            .getCount();
        const randomOffsets = new Set<number>();
        while (randomOffsets.size < teamsize) {
            const randomOffset = Math.floor(Math.random() * totalPokemons);
            randomOffsets.add(randomOffset);
        }
        const team: Pokemon[] = [];
        for (const offset of randomOffsets) {
            const pokemon = await this.pokemonRepository
                .createQueryBuilder('pokemon')
                .leftJoinAndSelect("pokemon.builds", "builds")
                .andWhere('builds.id IS NOT NULL')
                .skip(offset)
                .take(1)
                .getOne();      
            if (pokemon) {
                team.push(pokemon);
            }   
        }
        return team;
    }  
    async generateTeamNumberLegendarys(legendaryCount: number): Promise<Pokemon[]> {
        const teamsize = 6;
        if (legendaryCount < 0 || legendaryCount > teamsize) {
            throw new Error(`El número de legendarios debe estar entre 0 y ${teamsize}`);
        }
        const legendaryPokemons = await this.pokemonRepository
        .createQueryBuilder('pokemon')
        .leftJoinAndSelect('pokemon.builds', 'builds')
        .where('pokemon.isLegendary = true')
        .andWhere('builds.id IS NOT NULL')
        .getMany();

        const nonLegendaryPokemons = await this.pokemonRepository
            .createQueryBuilder('pokemon')
            .leftJoinAndSelect('pokemon.builds', 'builds')
            .where('pokemon.isLegendary = false')
            .andWhere('builds.id IS NOT NULL')
            .getMany();
        const team: Pokemon[] = [];

        const selectedLegendarys = new Set<number>();
        while (selectedLegendarys.size < legendaryCount) {
            const randomIndex = Math.floor(Math.random() * legendaryPokemons.length);
            selectedLegendarys.add(randomIndex);
        }       
        for (const index of selectedLegendarys) {
            team.push(legendaryPokemons[index]);
        }

        const nonLegendaryCount = teamsize - legendaryCount;
        const selectedNonLegendarys = new Set<number>();    
        while (selectedNonLegendarys.size < nonLegendaryCount) {
            const randomIndex = Math.floor(Math.random() * nonLegendaryPokemons.length);
            selectedNonLegendarys.add(randomIndex);
        }       
        for (const index of selectedNonLegendarys) {
            team.push(nonLegendaryPokemons[index]);
        }
        return team;
    }

    async generateTeamGenerationNumbers(generation: string[]): Promise<Pokemon[]> {
        const teamsize = 6;
        const team: Pokemon[] = [];
        const pokemonsByGeneration = await this.pokemonRepository
            .createQueryBuilder('pokemon')
            .where('pokemon.generation IN (:...generations)', { generations: generation })
            .leftJoinAndSelect("pokemon.builds", "builds")
            .andWhere('builds.id IS NOT NULL')
            .getMany(); 
        if (pokemonsByGeneration.length < teamsize) {
            throw new Error(`No hay suficientes Pokémon en las generaciones especificadas para formar un equipo de ${teamsize}`);
        }
        const selectedIndexes = new Set<number>();
        while (selectedIndexes.size < teamsize) {
            const randomIndex = Math.floor(Math.random() * pokemonsByGeneration.length);
            selectedIndexes.add(randomIndex);
        }
        for (const index of selectedIndexes) {
            team.push(pokemonsByGeneration[index]);
        }
        return team;
    }

    async generateTeamByTypes(types: string[]): Promise<Pokemon[]> {
        const teamsize = 6;
        const team: Pokemon[] = [];
        const pokemonsByTypes = await this.pokemonRepository
            .createQueryBuilder('pokemon')
            .where('pokemon.types IN (:...types)', { types })
            .leftJoinAndSelect("pokemon.builds", "builds")
            .andWhere('builds.id IS NOT NULL')
            .getMany(); 
        if (pokemonsByTypes.length < teamsize) {
            throw new Error(`No hay suficientes Pokémon de los tipos especificados para formar un equipo de ${teamsize}`);
        }
        const selectedIndexes = new Set<number>();
        while (selectedIndexes.size < teamsize) {
            const randomIndex = Math.floor(Math.random() * pokemonsByTypes.length);
            selectedIndexes.add(randomIndex);
        }
        for (const index of selectedIndexes) {
            team.push(pokemonsByTypes[index]);
        }
        return team;
    }

   async generateAnyAndSaveTxt(team: Pokemon[]): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join(process.cwd(), `team_${timestamp}.txt`);

    let text = `===== EQUIPO GENERADO =====\n\n`;

    for (const poke of team) {
        if (!poke.builds || poke.builds.length === 0) continue;

        const randomBuild = poke.builds[Math.floor(Math.random() * poke.builds.length)];

        if (randomBuild.buildText) {
            text += `${randomBuild.buildText}\n\n`;
        }
    }

    fs.writeFileSync(filePath, text.trim(), "utf8");
    return filePath;
    }



}

// TeamGeneratorService.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../Entities/Pokemon';

@Injectable()
export class TeamGeneratorService {
    constructor(
        @InjectRepository(Pokemon)
        private readonly pokemonRepository: Repository<Pokemon>,
    ) {}

    async generateRandomTeam(): Promise<Pokemon[]> {
        const teamsize = 6;
        const totalPokemons = await this.pokemonRepository.count();
        const randomOffsets = new Set<number>();
        while (randomOffsets.size < teamsize) {
            const randomOffset = Math.floor(Math.random() * totalPokemons);
            randomOffsets.add(randomOffset);
        }
        const team: Pokemon[] = [];
        for (const offset of randomOffsets) {
            const pokemon = await this.pokemonRepository
                .createQueryBuilder('pokemon')
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
        const legendaryPokemons = await this.pokemonRepository.find({ where: { isLegendary: true } });
        const nonLegendaryPokemons = await this.pokemonRepository.find({ where: { isLegendary: false } });
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

}

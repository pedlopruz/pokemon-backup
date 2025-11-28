// TeamGeneratorController.ts

import { Controller, Get, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../Entities/Pokemon';
import { TeamGeneratorService } from '../Services/TeamGeneratorService';

@Controller('generate-team')
export class TeamGeneratorController {
    constructor(private readonly teamGeneratorService: TeamGeneratorService) {}
    @Get()
    async generateTeam(): Promise<Pokemon[]> {
        return this.teamGeneratorService.generateRandomTeam();
    }
    @Get('legendary/:number')
    async generateTeamWithLegendarys(@Param('number', ParseIntPipe) number: number): Promise<Pokemon[]> {
        return this.teamGeneratorService.generateTeamNumberLegendarys(number);
    }

    @Get('generation/:generation')
    async generateTeamByGeneration(@Param('generation') generation: string): Promise<Pokemon[]> {
        const typesArray = generation.split(',');
        return this.teamGeneratorService.generateTeamGenerationNumbers(typesArray);
    }

    @Get('types/:types')
    async generateTeamByTypes(@Param('types') types: string): Promise<Pokemon[]> {
        const typesArray = types.split(',');
        return this.teamGeneratorService.generateTeamByTypes(typesArray);
    }
}
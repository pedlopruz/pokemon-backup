// TeamGeneratorController.ts

import { Controller, Get, Injectable, Param, ParseIntPipe, Post, Res, Query, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from "express";
import { Pokemon } from '../Entities/Pokemon';
import { TeamGeneratorService } from '../Services/TeamGeneratorService';
import { PokemonBuildService } from '../Services/PokemonBuildService';

@Controller('generate-team')
export class TeamGeneratorController {
    private readonly teamGeneratorService: TeamGeneratorService;
    private readonly PokemonBuildService: PokemonBuildService;

    constructor(teamGeneratorService: TeamGeneratorService, PokemonBuildService: PokemonBuildService) {
        this.teamGeneratorService = teamGeneratorService;
        this.PokemonBuildService = PokemonBuildService;
    }

    @Get('random')
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

    @Post("download-txt")
    async downloadTxt(
    @Body() body: { selections: { pokemonId: number; buildId: number }[] },
    @Res() res: Response
    ) {
        const { selections } = body;

        const lines: string[] = [];

        for (const sel of selections) {
            // Cargar la build por su ID
            const build = await this.PokemonBuildService.findById(sel.buildId);

            if (!build) continue;

            // build.buildText ya incluye todo el texto compatible con Showdown
            lines.push(build.buildText);
            lines.push(""); // separación entre builds
        }

        const txt = lines.join("\n");

        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", "attachment; filename=team.txt");

        return res.send(txt);
    }


}



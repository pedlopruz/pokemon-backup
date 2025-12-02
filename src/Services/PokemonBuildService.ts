// Service: PokemonBuildService

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonBuild } from '../Entities/PokemonBuild';

@Injectable()
export class PokemonBuildService {
    constructor(
        @InjectRepository(PokemonBuild)
        private readonly buildRepo: Repository<PokemonBuild>,
    ) {}

    async findById(id: number): Promise<PokemonBuild | null> {
        return this.buildRepo.findOne({
            where: { id },
            relations: ['pokemon'], // importante para el TXT final
        });
    }
}

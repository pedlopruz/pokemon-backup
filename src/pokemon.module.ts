import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokeApiController } from './Controllers/PokeApiController';
import { PokemonController } from './Controllers/PokemonController';
import { PokeApiService } from './Services/PokeApiService';
import { PokemonService } from './Services/PokemonService';
import { TeamGeneratorController } from './Controllers/TeamGeneratorController';
import { TeamGeneratorService } from './Services/TeamGeneratorService';
import { Pokemon } from './Entities/Pokemon';
import { SmogonService } from './Services/SmogonService';
import { PokemonBuild } from './Entities/PokemonBuild';
import { PokemonBuildService } from './Services/PokemonBuildService';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon]), TypeOrmModule.forFeature([PokemonBuild])],
  providers: [PokeApiService, PokemonService, TeamGeneratorService, SmogonService, PokemonBuildService],
  controllers: [PokeApiController, PokemonController, TeamGeneratorController],
})
export class PokemonModule {}

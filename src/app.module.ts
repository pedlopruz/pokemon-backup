import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonModule } from './pokemon.module';
import { Pokemon } from './Entities/Pokemon';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pokemon_user',      // ⬅ usuario que creaste
      password: 'pokemon_pass',      // ⬅ contraseña que creaste
      database: 'pokemon_db',        // ⬅ base de datos creada
      autoLoadEntities: true,        // carga automática de @Entity()
      synchronize: true,             // en desarrollo ON
    }),
    PokemonModule,
  ],
})
export class AppModule {}

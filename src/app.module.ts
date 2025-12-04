import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon.module';
import { AppService } from './app.service';
import { Pokemon } from './Entities/Pokemon';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PokemonModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000,
    }),

    // Necesario para injectar PokemonRepo en AppService
    TypeOrmModule.forFeature([Pokemon]),

   
  ],

  providers: [AppService], // <-- REGISTRAR AQUÍ
})
export class AppModule {}

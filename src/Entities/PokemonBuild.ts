// PokemonBuild.ts 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pokemon } from './Pokemon';


@Entity()
export class PokemonBuild {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Pokemon, (pokemon) => pokemon.builds, { onDelete: 'CASCADE' })
    pokemon: Pokemon;
    @Column({ type: 'text' })
    buildText: string;

}




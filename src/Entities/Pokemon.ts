import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { PokemonBuild } from './PokemonBuild';


@Entity()
export class Pokemon {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    pokedexNumber: number;
    @Column()
    name: string;
    @Column("simple-array")
    types: string[];
    @Column()
    generation: number;
    @Column()
    isLegendary: boolean;
    @Column()
    spriteUrl: string;
    @OneToMany(() => PokemonBuild, (build) => build.pokemon, {eager: true})
    builds: PokemonBuild[];



}

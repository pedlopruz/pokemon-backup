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
    @Column({ nullable: true })
    hp: number;

    @Column({ nullable: true })
    attack: number;

    @Column({ nullable: true })
    defense: number;

    @Column({ nullable: true })
    specialAttack: number;

    @Column({ nullable: true })
    specialDefense: number;

    @Column({ nullable: true })
    speed: number;

    @Column({ type: 'json' })
    typeEffectiveness: Record<string, number>;

    @Column()
    spriteUrl: string;
    @OneToMany(() => PokemonBuild, (build) => build.pokemon, {eager: true})
    builds: PokemonBuild[];



}

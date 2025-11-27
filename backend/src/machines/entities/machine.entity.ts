import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("machines")
export class Machine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    status: string;

    @Column("real")
    temperature: number;

    @Column("real")
    energyConsumption: number;
}

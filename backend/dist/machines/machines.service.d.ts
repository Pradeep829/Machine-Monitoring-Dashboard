import { Repository } from "typeorm";
import { Machine } from "./entities/machine.entity";
export declare class MachinesService {
    private machineRepository;
    constructor(machineRepository: Repository<Machine>);
    findAll(): Promise<Machine[]>;
    findOne(id: number): Promise<Machine>;
    findByName(nameOrSlug: string): Promise<Machine>;
    update(id: number, updateData: Partial<Machine>): Promise<Machine>;
    updateByName(name: string, updateData: Partial<Machine>): Promise<Machine>;
    seedData(): Promise<void>;
}

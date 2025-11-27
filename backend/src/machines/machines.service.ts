import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Machine } from "./entities/machine.entity";

@Injectable()
export class MachinesService {
    constructor(
        @InjectRepository(Machine)
        private machineRepository: Repository<Machine>
    ) {}

    async findAll(): Promise<Machine[]> {
        return this.machineRepository.find();
    }

    async findOne(id: number): Promise<Machine> {
        return this.machineRepository.findOne({ where: { id } });
    }

    async findByName(nameOrSlug: string): Promise<Machine> {
        // Try to find by exact name first (case-insensitive)
        let machine = await this.machineRepository
            .createQueryBuilder("machine")
            .where("LOWER(machine.name) = LOWER(:name)", { name: nameOrSlug })
            .getOne();

        // If not found, try converting slug to name format and search case-insensitively
        if (!machine) {
            // Get all machines and find by matching slug
            const allMachines = await this.machineRepository.find();

            // Convert each machine name to slug and compare
            for (const m of allMachines) {
                const machineSlug = m.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");

                if (machineSlug === nameOrSlug.toLowerCase()) {
                    machine = m;
                    break;
                }
            }
        }

        return machine;
    }

    async update(id: number, updateData: Partial<Machine>): Promise<Machine> {
        await this.machineRepository.update(id, updateData);
        const updated = await this.findOne(id);
        return updated;
    }

    async updateByName(name: string, updateData: Partial<Machine>): Promise<Machine> {
        const machine = await this.findByName(name);
        if (!machine) {
            return null;
        }
        await this.machineRepository.update(machine.id, updateData);
        return this.findOne(machine.id);
    }

    async seedData() {
        const count = await this.machineRepository.count();
        if (count === 0) {
            const machines = [
                {
                    name: "Lathe Machine",
                    status: "Running",
                    temperature: 75,
                    energyConsumption: 1200,
                },
                {
                    name: "CNC Milling Machine",
                    status: "Idle",
                    temperature: 65,
                    energyConsumption: 800,
                },
                {
                    name: "Injection Molding Machine",
                    status: "Stopped",
                    temperature: 85,
                    energyConsumption: 1500,
                },
            ];
            await this.machineRepository.save(machines);
        }
    }
}

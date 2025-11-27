"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachinesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const machine_entity_1 = require("./entities/machine.entity");
let MachinesService = class MachinesService {
    constructor(machineRepository) {
        this.machineRepository = machineRepository;
    }
    async findAll() {
        return this.machineRepository.find();
    }
    async findOne(id) {
        return this.machineRepository.findOne({ where: { id } });
    }
    async findByName(nameOrSlug) {
        let machine = await this.machineRepository
            .createQueryBuilder("machine")
            .where("LOWER(machine.name) = LOWER(:name)", { name: nameOrSlug })
            .getOne();
        if (!machine) {
            const allMachines = await this.machineRepository.find();
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
    async update(id, updateData) {
        await this.machineRepository.update(id, updateData);
        const updated = await this.findOne(id);
        return updated;
    }
    async updateByName(name, updateData) {
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
};
exports.MachinesService = MachinesService;
exports.MachinesService = MachinesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(machine_entity_1.Machine)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MachinesService);
//# sourceMappingURL=machines.service.js.map
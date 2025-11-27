import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from "@nestjs/common";
import { MachinesService } from "./machines.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MachinesGateway } from "./machines.gateway";
import { UpdateMachineDto } from "./dto/update-machine.dto";

@Controller("machines")
@UseGuards(JwtAuthGuard)
export class MachinesController {
    constructor(private readonly machinesService: MachinesService, private readonly machinesGateway: MachinesGateway) {}

    @Get()
    async findAll() {
        return this.machinesService.findAll();
    }

    @Get(":name")
    async findOne(@Param("name") name: string) {
        const machine = await this.machinesService.findByName(name);
        if (!machine) {
            throw new BadRequestException(`Machine with name "${name}" not found`);
        }
        return machine;
    }

    @Post(":name/update")
    async update(@Param("name") name: string, @Body() updateData: UpdateMachineDto) {
        // Check if machine exists
        const existingMachine = await this.machinesService.findByName(name);
        if (!existingMachine) {
            throw new BadRequestException(`Machine with name "${name}" not found`);
        }

        const updated = await this.machinesService.updateByName(name, updateData);
        this.machinesGateway.emitMachineUpdate(updated);
        return updated;
    }
}

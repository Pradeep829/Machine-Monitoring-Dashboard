import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MachinesController } from "./machines.controller";
import { MachinesService } from "./machines.service";
import { Machine } from "./entities/machine.entity";
import { MachinesGateway } from "./machines.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([Machine])],
    controllers: [MachinesController],
    providers: [MachinesService, MachinesGateway],
    exports: [MachinesService],
})
export class MachinesModule {}

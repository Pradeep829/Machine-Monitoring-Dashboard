import { MachinesService } from "./machines.service";
import { MachinesGateway } from "./machines.gateway";
import { UpdateMachineDto } from "./dto/update-machine.dto";
export declare class MachinesController {
    private readonly machinesService;
    private readonly machinesGateway;
    constructor(machinesService: MachinesService, machinesGateway: MachinesGateway);
    findAll(): Promise<import("./entities/machine.entity").Machine[]>;
    findOne(name: string): Promise<import("./entities/machine.entity").Machine>;
    update(name: string, updateData: UpdateMachineDto): Promise<import("./entities/machine.entity").Machine>;
}

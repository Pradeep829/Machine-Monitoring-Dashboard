import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Machine } from "./entities/machine.entity";
export declare class MachinesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
    emitMachineUpdate(machine: Machine): void;
    emitAllMachines(machines: Machine[]): void;
}

import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Machine } from "./entities/machine.entity";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
})
export class MachinesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    emitMachineUpdate(machine: Machine) {
        this.server.emit("machineUpdate", machine);
    }

    emitAllMachines(machines: Machine[]) {
        this.server.emit("allMachines", machines);
    }
}

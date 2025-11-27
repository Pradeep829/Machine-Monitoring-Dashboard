"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachinesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const machines_controller_1 = require("./machines.controller");
const machines_service_1 = require("./machines.service");
const machine_entity_1 = require("./entities/machine.entity");
const machines_gateway_1 = require("./machines.gateway");
let MachinesModule = class MachinesModule {
};
exports.MachinesModule = MachinesModule;
exports.MachinesModule = MachinesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([machine_entity_1.Machine])],
        controllers: [machines_controller_1.MachinesController],
        providers: [machines_service_1.MachinesService, machines_gateway_1.MachinesGateway],
        exports: [machines_service_1.MachinesService],
    })
], MachinesModule);
//# sourceMappingURL=machines.module.js.map
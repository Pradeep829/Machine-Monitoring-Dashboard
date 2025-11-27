import { IsOptional, IsNumber, IsString, IsIn, Min, Max } from "class-validator";

export class UpdateMachineDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(200)
    temperature?: number;

    @IsOptional()
    @IsString()
    @IsIn(["Running", "Idle", "Stopped"])
    status?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    energyConsumption?: number;
}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Machine } from "../machines/entities/machine.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "database.sqlite",
            entities: [Machine],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Machine]),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}

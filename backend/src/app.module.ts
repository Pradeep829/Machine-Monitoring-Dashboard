import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule, MachinesModule],
})
export class AppModule {}


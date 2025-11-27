import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MachinesService } from "./machines/machines.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    app.enableCors({
        origin: "http://localhost:3000",
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Seed database with initial data
    const machinesService = app.get(MachinesService);
    await machinesService.seedData();

    await app.listen(3001);
    console.log("Backend server running on http://localhost:3001");
}
bootstrap();

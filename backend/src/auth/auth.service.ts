import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<any> {
        // Static credentials as per requirements
        if (email === "admin@example.com" && password === "password123") {
            return { email, id: 1 };
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

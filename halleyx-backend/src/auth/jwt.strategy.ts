// halleyx-backend/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client'; // Import Role enum

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Check if the payload contains a role and ID
    if (!payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    let entity;
    if (payload.role === Role.ADMIN) {
      entity = await this.prisma.admin.findUnique({ where: { id: payload.sub } }); // Use prisma.admin
    } else if (payload.role === Role.CUSTOMER) {
      entity = await this.prisma.customer.findUnique({ where: { id: payload.sub } }); // Use prisma.customer
    } else {
      throw new UnauthorizedException('Unknown role in token');
    }

    if (!entity) {
      throw new UnauthorizedException('User not found');
    }

    // Return the entity (customer or admin) which will be attached to req.user
    return entity;
  }
}

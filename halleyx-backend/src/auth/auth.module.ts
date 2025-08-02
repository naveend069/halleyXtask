// halleyx-backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Ensure these are imported

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule, // Import ConfigModule here if it's not global, or if you need it for JwtModule.registerAsync
    JwtModule.registerAsync({
      imports: [ConfigModule], // Make sure ConfigModule is imported here for ConfigService injection
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get the secret from ConfigService
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService], // Inject ConfigService into the useFactory
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
// halleyx-backend/src/auth/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express'; // Import Request type from express
import { Customer } from '@prisma/client'; // Import Customer type from Prisma Client

/**
 * Custom interface to extend Express Request to include the 'user' property.
 * This is necessary because Passport.js attaches the authenticated user to req.user.
 */
interface ExpressRequest extends Request {
  user?: Customer; // Define the user property with the Customer type
}

/**
 * Custom decorator to extract the user object from the request.
 * This assumes that the JwtStrategy has successfully validated the token
 * and attached the user object to the request (e.g., req.user).
 *
 * Usage:
 * @GetUser() user: Customer
 * @GetUser('id') userId: string
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Cast the request to our custom ExpressRequest interface to include 'user' property
    const request = ctx.switchToHttp().getRequest<ExpressRequest>();
    
    // The user object is typically attached to req.user by Passport strategies
    // (e.g., JwtStrategy) after successful authentication.
    // If 'data' is provided (e.g., @GetUser('id')), return that specific property.
    // Otherwise, return the entire user object.
    return data ? request.user?.[data as keyof Customer] : request.user;
  },
);

import jwt, { SignOptions } from 'jsonwebtoken';

// Interface for type safety
interface JwtPayload {
  id: string;
  role?: string;
}

/**
 * Generates a JWT token for authentication.
 * @param jwtPayload - Object containing user ID and role
 * @param secret - JWT secret key
 * @param expiresIn - Token expiration time (e.g., '10d')
 * @returns Promise resolving to the generated JWT token
 * @throws Error if token generation fails
 */
async function generateToken(
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string
): Promise<string> {
  try {
    // Use the payload directly since IDs are already strings in Prisma
    const payload = {
      id: jwtPayload.id,
      role: jwtPayload.role,
    };

    // Validate inputs
    if (!payload.id) {
      throw new Error('Invalid payload: id  are required');
    }
    if (!secret) {
      throw new Error('JWT secret is missing');
    }
    if (!expiresIn) {
      throw new Error('Expiration time is missing');
    }

    // Generate token
    const token = jwt.sign(payload, secret, {
      expiresIn: expiresIn,
      issuer: 'AttendFlow',
      audience: 'AttendFlowAPI',
    } as any);
    return token;
  } catch (error: any) {
    throw new Error(`Failed to generate token: ${error.message}`);
  }
}

export default generateToken;

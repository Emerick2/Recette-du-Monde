import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
const saltRounds = 10;

export const HashPassword = async (text : string) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(text, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error);
    throw error;
  }
};

export const MakeTheJWT = async (text: string, jwtService: JwtService): Promise<string> => {
    const secret = process.env.JWT_TOKEN_KEY;
    if (!secret) {
        throw new Error('JWT_TOKEN_KEY is not configured');
    }

    return jwtService.signAsync(
        { sub: text },
        { secret, expiresIn: '1h' }
    );
};

export const WhoIAm = async (token: string, jwtService: JwtService): Promise<string> => {
    const secret = process.env.JWT_TOKEN_KEY;
    if (!secret) {
        throw new Error('JWT_TOKEN_KEY is not configured');
    }

    try {
        const payload = await jwtService.verifyAsync<{ sub: string }>(token, { secret });
        return payload.sub;
    } catch (error) {
        throw new UnauthorizedException('Jeton invalide ou expiré'); // Erreur 401
    }
};

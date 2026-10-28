import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const bcrypt = require('bcrypt');
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

/**
 * Attention, l'utilisation de cette fonction comporte des risques. Assurez-vous que l'utilisateur ne pourra pas voir le résultat de la fonction si l'on n'a pas la certitude qu'il est bien l'utilisateur dont il demande l'identifiant.
 */
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

/**
 * Vérification du jeton
 */
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


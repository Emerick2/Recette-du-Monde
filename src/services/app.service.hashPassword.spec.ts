import { JwtService } from '@nestjs/jwt';
import { afterEach, describe, expect, it } from 'vitest';
import { MakeTheJWT } from './app.service.hashPassword.js';

describe('MakeTheJWT', () => {
  const originalSecret = process.env.JWT_TOKEN_KEY;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_TOKEN_KEY;
    } else {
      process.env.JWT_TOKEN_KEY = originalSecret;
    }
  });

  it('signs the subject with the configured secret and gives the token an expiry', async () => {
    process.env.JWT_TOKEN_KEY = 'test-secret';

    const token = await MakeTheJWT('user-123');
    const payload = await new JwtService({ secret: 'test-secret' }).verifyAsync(token);

    expect(payload.sub).toBe('user-123');
    expect(payload.exp).toBeTypeOf('number');
  });

  it('throws when the signing secret is missing', async () => {
    delete process.env.JWT_TOKEN_KEY;

    await expect(MakeTheJWT('user-123')).rejects.toThrow(
      'JWT_TOKEN_KEY is not configured',
    );
  });
});

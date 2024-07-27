import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private revokedKeys: Set<string>;

  private apiKeyStore: Map<string, string>;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.apiKeyStore = new Map<string, string>();
    this.revokedKeys = new Set<string>();
  }

  generateCredentials(): { apiKey: string; apiSecret: string } {
    const apiKey = uuidv4();
    const apiSecret = this.jwtService.sign(
      {},
      { expiresIn: this.configService.get<string>('secretExpiration', '1h') },
    );
    this.apiKeyStore.set(apiKey, apiSecret);
    return { apiKey, apiSecret };
  }

  validateApiKey(apiKey: string): boolean {
    return this.apiKeyStore.has(apiKey); //&& !this.revokedKeys.has(apiKey);
  }

  validateApiSecret(apiKey: string, apiSecret: string): boolean {
    if (!this.validateApiKey(apiKey)) {
      return false;
    }

    const storedSecret = this.apiKeyStore.get(apiKey);
    try {
      this.jwtService.verify(apiSecret);
      return storedSecret === apiSecret;
    } catch (e) {
      return false;
    }
  }

  revokeApiKey(apiKey: string): void {
    if (this.apiKeyStore.has(apiKey)) {
      this.apiKeyStore.delete(apiKey);
      this.revokedKeys.add(apiKey);
    }
  }

  refreshApiSecret(apiKey: string): { apiSecret: string } {
    if (!this.validateApiKey(apiKey)) {
      throw new UnauthorizedException();
    }

    const apiSecret = this.jwtService.sign(
      {},
      { expiresIn: this.configService.get<string>('secretExpiration', '1h') },
    );
    this.apiKeyStore.set(apiKey, apiSecret);
    return { apiSecret };
  }

  getAllKeys() {
    return [...this.apiKeyStore.keys()];
  }
}

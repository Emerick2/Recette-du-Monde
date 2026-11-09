import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql from 'mysql2/promise';

@Injectable()
export class AppService implements OnModuleDestroy {

	private connexion: mysql.Pool;

    constructor(private configService: ConfigService) {
        this.connexion = mysql.createPool({
            host: 'localhost',
            user: 'api_user',
            password: this.configService.getOrThrow<string>('MOT_DE_PASSE_API'),
            database: 'recette_du_monde',
            waitForConnections: true,
            connectionLimit: 10
        });
    }

    async getRecettes() {
        const [resultat] = await this.connexion.query(
            'SELECT * FROM recette'
        );

        return resultat;
    }

    async onModuleDestroy() {
        await this.connexion.end();
    }
}
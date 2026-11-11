import { Injectable } from '@nestjs/common';
import type { User, UserDeletionRequest, UserLogin } from '../models/User.js';
import { HashPassword, MakeTheJWT, WhoIAm } from './app.service.hashPassword.js';
import {JwtService} from '@nestjs/jwt';
import mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppServiceUser {
    private connexion: mysql.Pool;
    
    constructor(private configService: ConfigService, private readonly jwtService: JwtService) {
        this.connexion = mysql.createPool({
            host: 'localhost',
            user: 'api_user',
            password: this.configService.getOrThrow<string>('MOT_DE_PASSE_API'),
            database: 'recette_du_monde',
            waitForConnections: true,
            connectionLimit: 10
        });
    }

    async onModuleDestroy() {
        await this.connexion.end();
    }

    async PostUser(data : User): Promise<string> {
        const query = `
            INSERT INTO utilisateur (nom, email, professionnel, mot_de_passe_hash)
            VALUES (?, ?, ?, ?);
        `

        const [rows]: any = await this.connexion.query(query, [data.name, data.email, data.professional, data.hashed_password]);   

        return '200';
  	}
  
    async CreateAnAccount(user : User): Promise<string> {
        if (user.name != null && user.name.length >= 3 && user.hashed_password != null && user.hashed_password.length > 8) {
            const hashed_user_want_deletion : string = await this.PostUser(user)
            if (hashed_user_want_deletion != '200') {
                return '404';
            } else {
                return await MakeTheJWT(user.email, this.jwtService);
            }
        }
        return '405';
    }

    async DeleteUser(data : UserDeletionRequest): Promise<string> {
        // Si l'utilisateur qui doit être supprimé existe.
        let query = `
            SELECT COUNT(*) as total 
            FROM utilisateur u 
            WHERE u.id = ?;
        `;
        let [rows]: any = await this.connexion.query(query, [data.idUser_deletion]);
        let userExists = rows[0].total > 0;
        if (!userExists) {
            throw new Error("Identifiants invalides");
        }

        // ---------------------------------
        // Si l'utilisateur qui veut supprimé existe
        let email = await WhoIAm(data.hashed_user_want_deletion, this.jwtService);
        query = `
            SELECT COUNT(*) as total 
            FROM utilisateur u 
            WHERE u.email = ? AND ((u.id = ?) OR (u.role = "administrateur" OR u.role = "super_utilisateur"));
        `;
        [rows] = await this.connexion.query(query, [email, data.idUser_deletion]);
        userExists = rows[0].total > 0;
        if (!userExists) {
            throw new Error("Identifiants invalides");
        }


        // ---------------------------------
        // Si l'utilisateur qui veut supprimé à le droit.
        // Supprimer l'utilisateur.
        query = `
            DELETE FROM utilisateur
            WHERE utilisateur.id = ?;
        `;
        [rows] = await this.connexion.query(query, [data.idUser_deletion]);
        
        return '200';
    }

    async GetUser(data: UserLogin): Promise<string> {
        const query = `
            SELECT COUNT(*) as total 
            FROM utilisateur u 
            WHERE u.email = ? AND u.mot_de_passe_hash = ?
        `;

        const [rows]: any = await this.connexion.query(query, [data.email, data.hashed_password]);

        const userExists = rows[0].total > 0;

        if (!userExists) {
            throw new Error("Identifiants invalides");
        }

        return MakeTheJWT(data.email, this.jwtService);
    }
}
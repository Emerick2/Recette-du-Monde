import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { User, UserDeletionRequest, UserLogin } from '../models/User.js';
import { HashPassword, MakeTheJWT, WhoIAm } from './app.service.hashPassword.js';
import {JwtService} from '@nestjs/jwt';
import mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

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
        try {
            const query = `
                INSERT INTO utilisateur (nom, email, professionnel, mot_de_passe_hash)
                VALUES (?, ?, ?, ?);
            `

            await this.connexion.query(query, [data.name, data.email, data.professional, data.hashed_password]);   
            
            return '201';
        } catch (error) {
            console.error("Erreur lors de la création du compte :", error);
            return '500';
        }
  	}
  
    async CreateAnAccount(user : User): Promise<string> {
        if (user.name != null && user.name.length >= 3 && user.hashed_password != null && user.hashed_password.length > 8) {
            user.hashed_password = await HashPassword(user.hashed_password);
            const hashed_user_want_deletion : string = await this.PostUser(user)
            if (hashed_user_want_deletion != '201') {
                throw new BadRequestException("Ce compte existe déjà.");
            } else {
                return await MakeTheJWT(user.email, this.jwtService);
            }
        } else {
            throw new BadRequestException("Valeurs du formulaire incorrectes.");
        }
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
            SELECT mot_de_passe_hash
            FROM utilisateur
            WHERE email = ?;
        `;

        const [rows]: any = await this.connexion.query(query, [data.email]);

        if (rows.length === 0) {
            throw new UnauthorizedException("Identifiants invalides.");
        }

        const motDePasseValide = await bcrypt.compare(
            data.hashed_password,
            rows[0].mot_de_passe_hash
        );

        if (!motDePasseValide) {
            throw new UnauthorizedException("Adresse e-mail ou mot de passe invalide.");
        }

        return MakeTheJWT(data.email, this.jwtService);
    }
}
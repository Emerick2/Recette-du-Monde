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

    async NameOfUserAlreadyUse(name : String) : Promise<boolean> {
        const query = `
            SELECT COUNT(*) as total 
            FROM utilisateur u 
            WHERE u.nom = ?;
        `;
        const [rows] : any = await this.connexion.query(query, [name]);
        const userExists : boolean = rows[0].total > 0;
        return userExists;
    } 

    async EMailOfUserAlreadyUse(name : String) : Promise<boolean> {
        const query = `
            SELECT COUNT(*) as total 
            FROM utilisateur u 
            WHERE u.email = ?;
        `;
        const [rows] : any = await this.connexion.query(query, [name]);
        const userExists : boolean = rows[0].total > 0;
        return userExists;
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
  
    async CreateAnAccount(user : User): Promise<Object> {
        if (user.name != null && user.name.length >= 3 && user.hashed_password != null && user.hashed_password.length > 8) {
            if (user.name.includes("@") || !user.email.includes("@")) {
                throw new UnauthorizedException("L'e-mail ou le nom d'utilisateur est invalide.");
            }
            const nameOfUserAlreadyUse : boolean = await this.NameOfUserAlreadyUse(user.name);
            if (nameOfUserAlreadyUse) {
                throw new BadRequestException("Ce nom d'utilisateur est déjà pris.");
            }

            const emailOfUserAlreadyUse : boolean = await this.EMailOfUserAlreadyUse(user.email);
            if (emailOfUserAlreadyUse) {
                throw new BadRequestException("Cet e-mail est déjà pris.");
            }

            user.hashed_password = await HashPassword(user.hashed_password);
            const hashed_user_want_deletion : string = await this.PostUser(user)
            if (hashed_user_want_deletion != '201') {
                throw new BadRequestException("Ce compte existe déjà.");
            } else {
                const jwtValue = await MakeTheJWT(user.email, this.jwtService);
                return {message: jwtValue, statusCode: 200};
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

    async GetUser(data: UserLogin): Promise<Object> {
        const query = `
            SELECT mot_de_passe_hash
            FROM utilisateur
            WHERE email = ? OR nom = ?;
        `;

        const [rows]: any = await this.connexion.query(query, [data.email, data.email]);

        if (rows.length === 0) {
            throw new UnauthorizedException("Adresse e-mail ou mot de passe invalide.");
        }

        const motDePasseValide = await bcrypt.compare(
            data.hashed_password,
            rows[0].mot_de_passe_hash
        );

        if (!motDePasseValide) {
            throw new UnauthorizedException("Adresse e-mail ou mot de passe invalide.");
        }

        return {message: MakeTheJWT(data.email, this.jwtService), statusCode: 200};
    }
}
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql from 'mysql2/promise';
import {WhoIAm} from './app.service.hashPassword.js';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AppServiceRecipe {

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

    async RecipeExists(idRecipe:number):Promise<boolean>{
        const query = `
            SELECT COUNT(*) as total 
            FROM recette r 
            WHERE r.id = ?;
        `;
        const [rows] : any = await this.connexion.query(query, [idRecipe]);
        const recipeExists : boolean = rows[0].total > 0;
        return recipeExists;
    }

    async UserExistsAndHasTheRight(tokenJwtUser:string):Promise<number>{
        // Ajout pour plus tard : On pourra ajouter ici une vérification pour empêcher un utilisateur banni de noter une recette. Pour le moment, aucune mention de “bannisement” n’est en vigueur dans la base de données.
        const email:string = await WhoIAm(tokenJwtUser, this.jwtService);
        const query = `
            SELECT COUNT(*) as total, u.id
            FROM utilisateur u 
            WHERE u.email = ?;
        `;
        const [rows] : any = await this.connexion.query(query, [email]);
        const userExistsAndHasTheRight : boolean = rows[0].total > 0;
        if (!userExistsAndHasTheRight){
            return -1;
        }
        return rows[0].id;
    }

    async UserHasAlreadyVoted(idRecipe:number, idUser:number):Promise<boolean>{
        const query = `
            SELECT COUNT(*) as total
            FROM note n
            WHERE n.id_recette = ? AND n.id_auteur = ?;
        `;
        const [rows] : any = await this.connexion.query(query, [idRecipe, idUser]);
        const userHasAlreadyVoted : boolean = rows[0].total > 0;
        return userHasAlreadyVoted;
    }

    async RecipeRating(target:number, idRecipe:number, tokenJwtUser:string) {
        /* Risque à bloquer :
        -* La note est hors limite.
        -* La recette n'existe pas.
        -* L'utilisateur n'existe pas ou n'as pas les droit (bannie).
        -* L'utilisateur n'a pas voter deux fois, sinon, changer son vote.
        */
        if (target < 1) target = 1;
        if (target > 5) target = 5; 

        const recipeExists:boolean = await this.RecipeExists(idRecipe);
        if (!recipeExists){
            throw new BadRequestException("Aucune recette possédant cet identifiant n'existe.");
        }

        const idUser:number = await this.UserExistsAndHasTheRight(tokenJwtUser);
        if (idUser < 0){
            throw new BadRequestException("Ce token n’est associé à aucun compte ou est associé à un compte ne possédant pas les droits pour réaliser cette action.");
        }

        const userHasAlreadyVoted:boolean = await this.UserHasAlreadyVoted(idRecipe, idUser);
        
    }
}
import { Injectable } from '@nestjs/common';
import type { User, UserDeletionRequest, UserLogin } from '../models/User.js';
import { HashPassword, WhoIAm } from './app.service.hashPassword.js';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AppServiceUser {
    constructor(private readonly jwtService: JwtService) {}

    PostUser(data : User): string {
        /*
        data.account_creation_date = Now();

        INSERT INTO genres (name, email, professional, account_creation_date, hashed_password)
        VALUES (data.name, data.email, data.professional, data.account_creation_date, data.hashed_password);
        */
        return '200';
  	}
  
    async CreateAnAccount(user : User): Promise<string> {
        if (user.name != null && user.name.length >= 3 && user.hashed_password != null && user.hashed_password.length > 8) {
            const hashed_user_want_deletion : string = this.PostUser(user)
            if (hashed_user_want_deletion != '200') {
                return '404';
            } else {
                return await WhoIAm(user.email, this.jwtService);
            }
        }
        return '200';
    }

    DeleteUser(data : UserDeletionRequest): string {
        // Si l'utilisateur qui doit être supprimé existe.
        /*
        SELECT COUNT(*)
        FROM user
        WHERE user.id = {data.idUser_deletion};
        */

        // ---------------------------------
        // Si l'utilisateur qui veut supprimé existe
        /*
        let email = WhoIAm(hashed_user_want_deletion)

        SELECT COUNT(*)
        FROM user
        WHERE user.email = {email} AND ((user.id = {data.idUser_deletion}) OR (user.role = "administrateur" OR user.role = "super_utilisateur"));
        */


        // ---------------------------------
        // Si l'utilisateur qui veut supprimé à le droit.
        // Supprimer l'utilisateur.
        /*
        DELETE FROM user
        WHERE user.id = {data.idUser_deletion};
        */


        return '200';
    }

    GetUser(data : UserLogin){
        // Si le mot de passe et le mail correspondent bien à un compte
        /*
        SELECT COUNT(*)
        FROM user
        WHERE user.email = {data.email} AND user.hashed_password = {data.hashed_password};
        */

        return HashPassword(data.email)
        // retourner hashed_user_want_deletion
    }
}
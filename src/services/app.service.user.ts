import { Injectable } from '@nestjs/common';
import type { User, UserDeletionRequest, UserLogin } from '../models/User.js';
import { HashPassword } from './app.service.hashPassword.js';

@Injectable()
export class AppServiceUser {
    PostUser(data : User): string {
    	return 'Bonjour !';
  	}
  
    CreateAnAccount(user : User): string {
        if (user.name != null && user.name.length >= 3 && user.hashed_password != null && user.hashed_password.length > 8) {
            const hashed_user_want_deletion : string = this.PostUser(user)
            if (hashed_user_want_deletion != '200') {
              return '404';
            } else {
                return hashed_user_want_deletion;
            }
        }
        return '200';
    }

    DeleteUser(data : UserDeletionRequest): string {
        // Si l'utilisateur qui doit être supprimé existe.
        // Si l'utilisateur qui veut supprimé existe
        // Si l'utilisateur qui veut supprimé à le droit.

        // Supprimer l'utilisateur.
        return 'Bonjour !';
    }

    GetUser(data : UserLogin){
        // Si le mot de passe et le mail correspondent bien à un compte
        
        return HashPassword(data.email)
        // retourner hashed_user_want_deletion
    }
}
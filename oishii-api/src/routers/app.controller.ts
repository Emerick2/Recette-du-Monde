import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { AppService } from '../services/app.service.js';
import { AppServiceUser } from '../services/app.service.user.js';
import type { User, UserDeletionRequest, UserLogin } from '../models/User.js';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly appServiceUser: AppServiceUser
	) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	// Se crée un compte :
	@Post("user")
	CreateAnAccount(@Body() donnees: User) {
		return this.appServiceUser.CreateAnAccount(donnees);
    }

	// Supprimé un compte :
	@Delete("user")
	DeleteUser(@Body() donnees: UserDeletionRequest) {
		return this.appServiceUser.DeleteUser(donnees);
    }

	// Se connecter.
	@Get("user")
	GetUser(@Body() donnees: UserLogin) {
		return this.appServiceUser.GetUser(donnees);
    }
}

/*
Les utilisateurs doivent pouvoir :

- Se crée un compte.
- Se connecter.
- Supprimé son compte.
Se déconnecter.
S'authentifier avec un cookie de session.

Les utilisateurs doivent être mis dans la base de données par appel API.
*/
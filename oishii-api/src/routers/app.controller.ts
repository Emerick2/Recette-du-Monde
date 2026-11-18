import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { AppService } from '../services/app.service.js';
import { AppServiceUser } from '../services/app.service.user.js';
import { AppServiceRecipe } from '../services/app.service.recipe.js';
import type { User, UserDeletionRequest, UserLogin } from '../models/User.js';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly appServiceUser: AppServiceUser,
		private readonly appServiceRecipe: AppServiceRecipe
	) {}

	@Get('recettes')
    getRecettes() {
        return this.appService.getRecettes();
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
	@Post("user/login")
	GetUser(@Body() donnees: UserLogin) {
		return this.appServiceUser.GetUser(donnees);
    }

	// Noter une recette.
	@Post("recipe/rating")
	RecipeRating(@Body() target: number, id_recipe : number, token_jwt_user:string) {
		return this.appServiceRecipe.RecipeRating(target, id_recipe, token_jwt_user);
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
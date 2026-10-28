import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service.js';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello("z");
	}

	@Get("usr")
	getBonjour(): string {
		return this.appService.getHello("oui");
	}


}

/*
Les utilisateurs doivent pouvoir :

Se crée un compte.
Se connecter.
Se déconnecter.
Supprimé son compte.
S'authentifier avec un cookie de session.
Les utilisateurs doivent être mis dans la base de données par appel API.
*/
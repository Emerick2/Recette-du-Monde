import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  	getHello(name : string): string {
    	return 'Bonjour !'+name;
  	}

	getBonjour(name : string): string {
    	return 'Bonjour !'+name;
  	}
}

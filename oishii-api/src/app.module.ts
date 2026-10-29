import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './routers/app.controller.js';
import { AppService } from './services/app.service.js';
import { AppServiceUser } from './services/app.service.user.js';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AppController],
  providers: [AppService, AppServiceUser],
})
export class AppModule {}

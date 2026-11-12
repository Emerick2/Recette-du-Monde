import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './routers/app.controller.js';
import { AppService } from './services/app.service.js';
import { AppServiceUser } from './services/app.service.user.js';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService, AppServiceUser],
})
export class AppModule {}

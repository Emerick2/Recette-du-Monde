import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from '../services/app.service.js';
import { AppServiceUser } from '../services/app.service.user.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AppServiceUser,
          useValue: {
            CreateAnAccount: vi.fn(),
            DeleteUser: vi.fn(),
            GetUser: vi.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Bonjour !"', () => {
      expect(appController.getHello()).toBe('Bonjour !');
    });
  });
});

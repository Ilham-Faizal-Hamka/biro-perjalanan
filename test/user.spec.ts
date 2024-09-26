import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { Logger } from 'winston';


describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe("POST /register", () => {
    beforeEach(async() => {
      await testService.deleteUser();
    })
    
    it("should reject if request is invalid", async() => {
      const response = await request(app.getHttpServer())
        .post("/register")
        .send({
          username: '',
          password: '',
          name: '',
          email: '',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should be able to register new user", async() => {
      const response = await request(app.getHttpServer())
        .post("/register")
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
          email: 'test@gmail.com',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.email).toBe('test@gmail.com');
    });

    it("shloud reject if username already exist", async() => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post("/register")
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
          email: 'test@gmail.com',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
  });

  describe("POST /login", () => {
    beforeEach(async() => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it("should can login if request is valid", async() => {
      const response = await request(app.getHttpServer())
        .post("/login")
        .send({
          username: 'test',
          password: 'test',
        });

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.email).toBe('test@gmail.com');
        expect(response.body.data.token).toBeDefined();
    })
  })

});

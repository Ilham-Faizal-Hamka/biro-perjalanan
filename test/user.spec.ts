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
    });

    afterEach(async() => {
      await testService.deleteAll();
    });
    
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

    afterEach(async() => {
      await testService.deleteAll();
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
    });

    it("should reject if username or password doesn't match", async() => {
      const response = await request(app.getHttpServer())
        .post("/login")
        .send({
          username: 'test',
          password: 'test1',
        });

        logger.info(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /account", () => {
    beforeEach(async() => {
      await testService.deleteAll();
      await testService.createUser();
    });

    afterEach(async() => {
      await testService.deleteAll();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/account')
        .set('Authorization', 'wrong-token');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it("should be able to get account if token is valid", async() => {
      const response = await request(app.getHttpServer())
        .get("/account")
        .set('Authorization', 'test');

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe('test');
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.email).toBe('test@gmail.com');
    });
  });

  describe("PATCH /account", () => {
    beforeEach(async() => {
      await testService.deleteAll();
      await testService.createUser();
    });

    afterEach(async() => {
      await testService.deleteAll();
    });

    it("should can update user password", async() => {
      const response = await request(app.getHttpServer())
        .patch("/account")
        .set('Authorization', 'test')
        .send({
          password: 'test-update',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.email).toBe('test@gmail.com');
    });

    it("should can update user name", async() => {
      const response = await request(app.getHttpServer())
        .patch("/account")
        .set('Authorization', 'test')
        .send({
          name: 'test-update',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test-update');
      expect(response.body.data.email).toBe('test@gmail.com');
    });

    it("should can update email", async() => {
      const response = await request(app.getHttpServer())
        .patch("/account")
        .set('Authorization', 'test')
        .send({
          email: 'test-update@gmail.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.email).toBe('test-update@gmail.com');
    });

    it("should reject if user unathorized", async() => {
      const response = await request(app.getHttpServer())
        .patch("/account")
        .set('Authorization', 'wrong')
        .send({
          name: 'test-update',
        });

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it("should reject if request is invalid", async() => {
      const response = await request(app.getHttpServer())
        .patch("/account")
        .set('Authorization', 'test')
        .send({
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("DELETE /account" , () => {
    beforeEach(async() => {
      await testService.deleteAll();
      await testService.createUser();
    });

    afterEach(async() => {
      await testService.deleteAll();
    });

    it("should can logout user", async() => {
      const response = await request(app.getHttpServer())
        .delete("/account")
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
    });
    
  })

});

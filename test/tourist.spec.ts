import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { Logger } from 'winston';


describe('TouristController', () => {
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

  describe("POST /admin/tourist/create", () => {
    beforeEach(async() => {
      await testService.deleteTourist();
      await testService.deleteUser();

      await testService.createUser();
    });

    afterEach(async() => {
      await testService.deleteAll();
    });
    
    it("should reject if request is invalid", async() => {
      const response = await request(app.getHttpServer())
        .post("/admin/tourist/create")
        .set('Authorization', 'test')
        .send({
          nik: '',
          name: '',
          email: '',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should be able to create new tourist", async() => {
      const response = await request(app.getHttpServer())
        .post("/admin/tourist/create")
        .set('Authorization', 'test')
        .send({
          nik: '12345676474574754',
          name: 'test',
          email: 'test@gmail.com',
        });

        expect(response.status).toBe(200);
        expect(response.body.data.nik).toBe('12345676474574754');
        expect(response.body.data.name).toBe('test');
        expect(response.body.data.email).toBe('test@gmail.com');
    });

    it("shloud reject tourist if nik already registered", async() => {
      await testService.createTourist();

      const response = await request(app.getHttpServer())
        .post("/admin/tourist/create")
        .set('Authorization', 'test')
        .send({
          nik: '1234567890',
          name: 'test-123',
          email: 'test-123@gmail.com',
        });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
  });

  describe("GET /admin/tourist/:touristId", () => {
    beforeEach(async() => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTourist();
    });

    afterEach(async() => {
      await testService.deleteAll();
    })
    it("should return tourist data if tourist id is valid", async() => {
      const tourist = await testService.getTourist();

      const response = await request(app.getHttpServer())
        .get(`/admin/tourist/${tourist.id}`)
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(tourist.id);
      expect(response.body.data.nik).toBe(tourist.nik);
      expect(response.body.data.name).toBe(tourist.name);
      expect(response.body.data.email).toBe(tourist.email);
    });

    it("should reject if tourist id is invalid", async() => {
      const response = await request(app.getHttpServer())
        .get(`/admin/tourist/123`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("PUT /admin/tourist/:touristId", () => {
    beforeEach(async() => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTourist();
    });

    afterEach(async() => {
      await testService.deleteAll();
    });

    it("should can update tourist data", async() => {
      const tourist = await testService.getTourist();

      const response = await request(app.getHttpServer())
        .put(`/admin/tourist/${tourist.id}`)
        .set('Authorization', 'test')
        .send({
          id: tourist.id,
          name: 'test-new',
          email: 'test-new@gmail.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(tourist.id);
      expect(response.body.data.nik).toBe('1234567890');
      expect(response.body.data.name).toBe('test-new');
      expect(response.body.data.email).toBe('test-new@gmail.com');
    });

    it("should reject if user is unauthorized", async() => {
      const tourist = await testService.getTourist();

      const response = await request(app.getHttpServer())
        .put(`/admin/tourist/${tourist.id}`)
        .set('Authorization', 'wrong')
        .send({
          id: tourist.id,
          name: 'test-new',
          email: 'test-new@gmail.com',
        });
      
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it("should reject if input is invalid", async() => {
      const tourist = await testService.getTourist();

      const response = await request(app.getHttpServer())
        .put(`/admin/tourist/${tourist.id}`)
        .set('Authorization', 'test')
        .send({
          id: tourist.id,
          name: 123,
          email: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("DELETE /admin/tourist/:touristId", () => {
    beforeEach(async() => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTourist();
    });

    afterEach(async() => {
      await testService.deleteAll();
    });

    it("should can delete Tourist", async() => {
      const tourist = await testService.getTourist();

      const response = await request(app.getHttpServer())
        .delete(`/admin/tourist/${tourist.id}`)
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(tourist.id);
    });

    it("should reject if id is invalid", async() => {
      const response = await request(app.getHttpServer())
        .delete(`/admin/tourist/123`)
        .set('Authorization', 'test');

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it("should reject if user is unauthorized", async() => {
      const tourist = await testService.getTourist();

      const response = await request(app.getHttpServer())
        .delete(`/admin/tourist/${tourist.id}`)
        .set('Authorization', 'wrong')

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });
});

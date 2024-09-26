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

  describe("POST /tourist/create", () => {
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
        .post("/tourist/create")
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
        .post("/tourist/create")
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
        .post("/tourist/create")
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
  
});

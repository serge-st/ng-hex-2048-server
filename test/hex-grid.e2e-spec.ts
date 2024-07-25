import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HexGridController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const controllerRoute = '/hex-grid-management';

  describe('shoud throw', () => {
    it(`(GET) ${controllerRoute}`, () => {
      return request(app.getHttpServer()).get(controllerRoute).expect(404);
    });

    it(`(POST) ${controllerRoute} without URL param `, () => {
      return request(app.getHttpServer()).post(controllerRoute).expect(404);
    });

    it(`(POST) ${controllerRoute}/1 without a body`, () => {
      return request(app.getHttpServer()).post(`${controllerRoute}/1`).expect(400);
    });

    it(`(POST) ${controllerRoute}/1 with incorrect hexagon coordinates`, () => {
      return request(app.getHttpServer())
        .post(`${controllerRoute}/1`)
        .send([{ q: 1, r: 2, s: 3, value: 2 }])
        .expect(400);
    });

    it(`(POST) ${controllerRoute}/1 with incorrect DTO`, () => {
      return request(app.getHttpServer())
        .post(`${controllerRoute}/1`)
        .send([{ x: 0, r: 0, s: 0, value: 2 }])
        .expect(400);
    });
  });

  describe('should succeed', () => {
    it(`(POST) ${controllerRoute}/1 with URL param and empty array`, () => {
      return request(app.getHttpServer()).post(`${controllerRoute}/1`).send([]).expect(201);
    });

    it(`(POST) ${controllerRoute}/1 with URL param and array with elements`, () => {
      return request(app.getHttpServer())
        .post(`${controllerRoute}/1`)
        .send([{ q: 0, r: 0, s: 0, value: 2 }])
        .expect(201);
    });
  });
});

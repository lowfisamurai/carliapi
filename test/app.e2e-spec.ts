import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface StudyPlansListResponse {
  items: Array<{
    id: number;
    title: string;
  }>;
  summary: {
    total: number;
    completed: number;
    remaining: number;
    totalFocusMinutes: number;
  };
}

interface StudyPlanResponse {
  id: number;
  done: boolean;
}

interface ValidationErrorResponse {
  message: string[];
}

describe('Carli API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', {
      exclude: [
        { path: '/', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
      ],
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('GET / returns API metadata', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      name: 'Carli API',
      status: 'ok',
      docs: '/api/study-plans',
    });
  });

  it('GET /api/study-plans returns seeded plans and summary', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/study-plans')
      .expect(200);

    const body = response.body as StudyPlansListResponse;

    expect(body.summary).toEqual({
      total: 3,
      completed: 1,
      remaining: 2,
      totalFocusMinutes: 155,
    });
    expect(body.items[0].title).toBe('Configurar pipeline inicial');
  });

  it('POST /api/study-plans creates a plan', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/study-plans')
      .send({
        title: 'Criar screenshot da PR',
        topic: 'DevOps',
        difficulty: 'beginner',
        focusMinutes: 30,
      })
      .expect(201);

    const body = response.body as StudyPlanResponse;

    expect(body.done).toBe(false);
    expect(body.id).toBe(4);
  });

  it('PATCH /api/study-plans/:id updates a plan', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/study-plans/3')
      .send({
        done: true,
      })
      .expect(200);

    const body = response.body as StudyPlanResponse;

    expect(body.done).toBe(true);
    expect(body.id).toBe(3);
  });

  it('rejects invalid payloads', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/study-plans')
      .send({
        title: 'Teste',
        topic: 'NestJS',
        difficulty: 'expert',
        focusMinutes: 10,
      })
      .expect(400);

    const body = response.body as ValidationErrorResponse;

    expect(body.message).toEqual(
      expect.arrayContaining([
        'difficulty must be one of the following values: beginner, intermediate, advanced',
        'focusMinutes must not be less than 15',
      ]),
    );
  });

  afterEach(async () => {
    await app.close();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlansService } from './study-plans.service';

describe('StudyPlansService', () => {
  let service: StudyPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyPlansService],
    }).compile();

    service = module.get<StudyPlansService>(StudyPlansService);
  });

  it('returns the seeded plans summary', () => {
    const response = service.findAll();

    expect(response.items).toHaveLength(3);
    expect(response.summary).toEqual({
      total: 3,
      completed: 1,
      remaining: 2,
      totalFocusMinutes: 155,
    });
  });

  it('creates a new plan as pending by default', () => {
    const created = service.create({
      title: 'Publicar imagem no Docker Hub',
      topic: 'Docker',
      difficulty: 'advanced',
      focusMinutes: 75,
    });

    expect(created.id).toBe(4);
    expect(created.done).toBe(false);
    expect(created.topic).toBe('Docker');
  });

  it('updates an existing plan', () => {
    const updated = service.update(2, {
      done: true,
      focusMinutes: 70,
    });

    expect(updated.done).toBe(true);
    expect(updated.focusMinutes).toBe(70);
  });
});

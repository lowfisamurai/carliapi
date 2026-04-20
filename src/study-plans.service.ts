import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudyPlanDto, UpdateStudyPlanDto } from './study-plans.dto';
import { StudyPlan } from './study-plans.types';

@Injectable()
export class StudyPlansService {
  private nextId = 4;

  private readonly studyPlans: StudyPlan[] = [
    {
      id: 1,
      title: 'Configurar pipeline inicial',
      topic: 'GitHub Actions',
      difficulty: 'beginner',
      done: true,
      focusMinutes: 45,
      createdAt: '2026-04-18T19:30:00.000Z',
    },
    {
      id: 2,
      title: 'Escrever testes e2e',
      topic: 'NestJS',
      difficulty: 'intermediate',
      done: false,
      focusMinutes: 60,
      createdAt: '2026-04-19T14:00:00.000Z',
    },
    {
      id: 3,
      title: 'Empacotar a API com Docker',
      topic: 'Containers',
      difficulty: 'intermediate',
      done: false,
      focusMinutes: 50,
      createdAt: '2026-04-20T12:15:00.000Z',
    },
  ];

  findAll() {
    return {
      items: this.studyPlans,
      summary: this.buildSummary(),
    };
  }

  findOne(id: number) {
    return this.getById(id);
  }

  create(payload: CreateStudyPlanDto) {
    const studyPlan: StudyPlan = {
      id: this.nextId++,
      done: false,
      createdAt: new Date().toISOString(),
      ...payload,
    };

    this.studyPlans.unshift(studyPlan);

    return studyPlan;
  }

  update(id: number, payload: UpdateStudyPlanDto) {
    const studyPlan = this.getById(id);

    Object.assign(studyPlan, payload);

    return studyPlan;
  }

  remove(id: number) {
    const index = this.studyPlans.findIndex((plan) => plan.id === id);

    if (index === -1) {
      throw new NotFoundException(`Study plan ${id} was not found.`);
    }

    const [removed] = this.studyPlans.splice(index, 1);

    return removed;
  }

  private buildSummary() {
    const total = this.studyPlans.length;
    const completed = this.studyPlans.filter((plan) => plan.done).length;
    const remaining = total - completed;
    const totalFocusMinutes = this.studyPlans.reduce(
      (sum, plan) => sum + plan.focusMinutes,
      0,
    );

    return {
      total,
      completed,
      remaining,
      totalFocusMinutes,
    };
  }

  private getById(id: number) {
    const studyPlan = this.studyPlans.find((plan) => plan.id === id);

    if (!studyPlan) {
      throw new NotFoundException(`Study plan ${id} was not found.`);
    }

    return studyPlan;
  }
}

/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlansController } from './study-plans.controller';
import { StudyPlansService } from './study-plans.service';

describe('StudyPlansController - Testes Unitários', () => {
  let controller: StudyPlansController;
  let service: StudyPlansService;

  //Trocamos para mockReturnValue (síncrono), pois a sua API em memória
  // resolve os dados imediatamente sem precisar de Promessas.
  const mockStudyPlansService = {
    findAll: jest.fn().mockReturnValue(['Plano 1', 'Plano 2']),
    findOne: jest.fn().mockReturnValue({ id: 1, name: 'Plano DevOps' }),
    create: jest.fn().mockReturnValue({ id: 2, name: 'Novo Plano' }),
    update: jest.fn().mockReturnValue({ id: 1, name: 'Plano Atualizado' }),
    remove: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyPlansController],
      providers: [
        {
          provide: StudyPlansService,
          useValue: mockStudyPlansService,
        },
      ],
    }).compile();

    controller = module.get<StudyPlansController>(StudyPlansController);
    service = module.get<StudyPlansService>(StudyPlansService);
  });

  // Os testes foram adaptados para refletir a natureza síncrona do Controller atual.
  it('1. findAll() deve retornar uma lista com todos os planos', () => {
    const result = controller.findAll();
    expect(result.length).toBe(2);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('2. findOne() deve retornar um plano de estudo específico pelo ID', () => {
    const result = controller.findOne(1);
    expect(result.name).toBe('Plano DevOps');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('3. create() deve criar um novo plano com sucesso', () => {
    const payload = { name: 'Novo Plano' };
    const result = controller.create(payload as any);
    expect(result.id).toBe(2);
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('4. update() deve atualizar os dados de um plano existente', () => {
    const payload = { name: 'Plano Atualizado' };
    const result = controller.update(1, payload as any);
    expect(result.name).toBe('Plano Atualizado');
    expect(service.update).toHaveBeenCalledWith(1, payload);
  });

  it('5. remove() deve deletar o plano e retornar verdadeiro', () => {
    const result = controller.remove(1);
    expect(result).toBe(true);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});

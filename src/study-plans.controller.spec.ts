import { Test, TestingModule } from '@nestjs/testing';
import { StudyPlansController } from './study-plans.controller';
import { StudyPlansService } from './study-plans.service';

describe('StudyPlansController - Testes Unitários', () => {
  let controller: StudyPlansController;
  let service: StudyPlansService;

  // Optamos por criar um "mock" completo do StudyPlansService.
  const mockStudyPlansService = {
    findAll: jest.fn().mockResolvedValue(['Plano 1', 'Plano 2']),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Plano DevOps' }),
    create: jest.fn().mockResolvedValue({ id: 2, name: 'Novo Plano' }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Plano Atualizado' }),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    //Configuração do TestingModule do NestJS para isolar o Controller usando o Provider injetado.
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

  // Teste 1 (A rota GET principal). Pega tudo.
  it('1. findAll() deve retornar uma lista com todos os planos', async () => {
    const result = await controller.findAll();
    expect(result.length).toBe(2);
    expect(service.findAll).toHaveBeenCalled();
  });

  // Teste 2 verifica se a passagem de parâmetros dinâmicos (@Param) está sendo enviada corretamente para o service.
  it('2. findOne() deve retornar um plano de estudo específico pelo ID', async () => {
    const result = await controller.findOne(1);
    expect(result.name).toBe('Plano DevOps');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  //Teste 3 (A rota POST). Testa se o corpo da requisição (payload) chega no método create.
  it('3. create() deve criar um novo plano com sucesso', async () => {
    const payload = { name: 'Novo Plano' };
    const result = await controller.create(payload as any);
    expect(result.id).toBe(2);
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  // Teste 4 (A rota PATCH). Valida a injeção simultânea de ID e do Data Transfer Object (DTO) parcial.
  it('4. update() deve atualizar os dados de um plano existente', async () => {
    const payload = { name: 'Plano Atualizado' };
    const result = await controller.update(1, payload as any);
    expect(result.name).toBe('Plano Atualizado');
    expect(service.update).toHaveBeenCalledWith(1, payload);
  });

  //Teste 5 (A rota DELETE). O mais rápido de todos, só confirma se o retorno de sucesso é verdadeiro.
  it('5. remove() deve deletar o plano e retornar verdadeiro', async () => {
    const result = await controller.remove(1);
    expect(result).toBe(true);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});

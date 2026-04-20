import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStudyPlanDto, UpdateStudyPlanDto } from './study-plans.dto';
import { StudyPlansService } from './study-plans.service';

@Controller('study-plans')
export class StudyPlansController {
  constructor(private readonly studyPlansService: StudyPlansService) {}

  @Get()
  findAll() {
    return this.studyPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studyPlansService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateStudyPlanDto) {
    return this.studyPlansService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateStudyPlanDto,
  ) {
    return this.studyPlansService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studyPlansService.remove(id);
  }
}

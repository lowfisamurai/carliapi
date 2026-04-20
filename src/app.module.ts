import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { StudyPlansController } from './study-plans.controller';
import { StudyPlansService } from './study-plans.service';

@Module({
  imports: [],
  controllers: [HealthController, StudyPlansController],
  providers: [StudyPlansService],
})
export class AppModule {}

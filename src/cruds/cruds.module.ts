import { Module } from '@nestjs/common';
import { CrudsService } from './cruds.service';
import { CrudsController } from './cruds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatioImporters } from './entities/patio_importers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatioImporters])],
  controllers: [CrudsController],
  providers: [CrudsService],
})
export class CrudsModule { }

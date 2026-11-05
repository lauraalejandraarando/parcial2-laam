
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecintosController } from './recintos.controller';
import { RecintosService } from './recintos.service';
import { Recinto } from '../entities/recinto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recinto])],
  controllers: [RecintosController],
  providers: [RecintosService],
})
export class RecintosModule {}

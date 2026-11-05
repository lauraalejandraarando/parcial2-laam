
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recinto } from '../entities/recinto.entity';

@Injectable()
export class RecintosService {
  constructor(
    @InjectRepository(Recinto)
    private readonly recintoRepository: Repository<Recinto>,
  ) {}

  async findAll() {
    return await this.recintoRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const recinto = await this.recintoRepository.findOne({
      where: { id },
    });

    if (!recinto) {
      throw new NotFoundException(`No se encontró el recinto ${id}`);
    }

    return recinto;
  }

  async create(datos: Partial<Recinto>) {
    const recinto = this.recintoRepository.create(datos);
    return await this.recintoRepository.save(recinto);
  }

  async update(id: number, datos: Partial<Recinto>) {
    const recinto = await this.findOne(id);
    Object.assign(recinto, datos);
    return await this.recintoRepository.save(recinto);
  }

  async remove(id: number) {
    const recinto = await this.findOne(id);
    await this.recintoRepository.softRemove(recinto);

    return {
      mensaje: 'Recinto eliminado correctamente',
    };
  }
}

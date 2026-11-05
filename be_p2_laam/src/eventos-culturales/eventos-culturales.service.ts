
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventoCultural } from '../entities/evento-cultural.entity';
import { Recinto } from '../entities/recinto.entity';

@Injectable()
export class EventosCulturalesService {
  constructor(
    @InjectRepository(EventoCultural)
    private readonly eventoRepository: Repository<EventoCultural>,

    @InjectRepository(Recinto)
    private readonly recintoRepository: Repository<Recinto>,
  ) {}

  async findAll() {
    return await this.eventoRepository.find({
      relations: { recinto: true },
      order: { fecha_evento: 'ASC' },
    });
  }

  async findOne(id: number) {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: { recinto: true },
    });

    if (!evento) {
      throw new NotFoundException(`No se encontró el evento ${id}`);
    }

    return evento;
  }

  async create(datos: any) {
    const { id_recinto, ...resto } = datos;

    const recinto = await this.recintoRepository.findOne({
      where: { id: id_recinto },
    });

    if (!recinto) {
      throw new BadRequestException('El recinto indicado no existe');
    }

    const evento = this.eventoRepository.create({
      ...resto,
      recinto,
    });

    return await this.eventoRepository.save(evento);
  }

  async update(id: number, datos: any) {
    const evento = await this.findOne(id);
    const { id_recinto, ...resto } = datos;

    if (id_recinto !== undefined) {
      const recinto = await this.recintoRepository.findOne({
        where: { id: id_recinto },
      });

      if (!recinto) {
        throw new BadRequestException('El recinto indicado no existe');
      }

      evento.recinto = recinto;
    }

    Object.assign(evento, resto);

    return await this.eventoRepository.save(evento);
  }

  async remove(id: number) {
    const evento = await this.findOne(id);

    await this.eventoRepository.softRemove(evento);

    return {
      mensaje: 'Evento cultural eliminado correctamente',
    };
  }
}


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Recinto } from './recinto.entity';

export enum EstadoEvento {
  PROGRAMADO = 'Programado',
  AGOTADO = 'Agotado',
  CANCELADO = 'Cancelado',
}

@Entity('eventos_culturales')
export class EventoCultural {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recinto, { nullable: false })
  @JoinColumn({ name: 'id_recinto' })
  recinto: Recinto;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'varchar', length: 100 })
  artista_principal: string;

  @Column({ type: 'integer' })
  duracion_minutos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_entrada: number;

  @Column({ type: 'date' })
  fecha_evento: Date;

  @Column({
    type: 'enum',
    enum: EstadoEvento,
    default: EstadoEvento.PROGRAMADO,
  })
  estado: EstadoEvento;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @DeleteDateColumn()
  fecha_eliminacion: Date;
}

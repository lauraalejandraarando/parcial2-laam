import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  PartialType,
} from '@nestjs/swagger';

import { RecintosService } from './recintos.service';
import { CrearRecintoDto } from '../dto/crear-recinto.dto';

class ActualizarRecintoDto extends PartialType(CrearRecintoDto) {}

@ApiTags('Recintos')
@Controller('recintos')
export class RecintosController {
  constructor(private readonly recintosService: RecintosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los recintos' })
  @ApiResponse({ status: 200, description: 'Lista de recintos' })
  findAll() {
    return this.recintosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un recinto por ID' })
  @ApiResponse({ status: 200, description: 'Recinto encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recintosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo recinto' })
  @ApiBody({ type: CrearRecintoDto })
  @ApiResponse({ status: 201, description: 'Recinto creado correctamente' })
  create(@Body() datos: CrearRecintoDto) {
    return this.recintosService.create(datos);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un recinto' })
  @ApiBody({ type: ActualizarRecintoDto })
  @ApiResponse({ status: 200, description: 'Recinto actualizado correctamente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: ActualizarRecintoDto,
  ) {
    return this.recintosService.update(id, datos);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un recinto' })
  @ApiResponse({ status: 200, description: 'Recinto eliminado correctamente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recintosService.remove(id);
  }
}
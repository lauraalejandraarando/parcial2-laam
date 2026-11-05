
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Recinto } from './entities/recinto.entity';
import { EventoCultural } from './entities/evento-cultural.entity';
import { RecintosModule } from './recintos/recintos.module';
import { EventosCulturalesModule } from './eventos-culturales/eventos-culturales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [Recinto, EventoCultural],
      synchronize: true,
    }),
    RecintosModule,
    EventosCulturalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

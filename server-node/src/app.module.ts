import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GameModule],
})
export class AppModule {}

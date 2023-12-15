import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RecommenderController } from './recommender.controller';
import { RecommenderService } from './recommender.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          baseURL: config.getOrThrow<string>('RECOMMENDER_SYSTEM_BASE_URL'),
        };
      },
    }),
  ],
  providers: [RecommenderService],
  controllers: [RecommenderController],
})
export class RecommenderModule {}

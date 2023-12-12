import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PrismaAsyncModuleOptions, PrismaModuleOptions } from '@src/prisma/prisma.interfaces';
import { PrismaService } from '@src/prisma/prisma.service';

@Module({})
export class PrismaModule {
  public static forRoot(options: PrismaModuleOptions): DynamicModule {
    const { url, enableLog = true } = options;
    const ServiceProvider: Provider<PrismaService> = {
      provide: PrismaService,
      useValue: new PrismaService(url, enableLog),
    };
    return {
      global: true,
      module: PrismaModule,
      exports: [ServiceProvider],
    };
  }

  public static forRootAsync(options: PrismaAsyncModuleOptions): DynamicModule {
    const { useFactory, imports = [], inject = [] } = options;
    const ModuleOptionsProvider: Provider<PrismaModuleOptions> = {
      provide: 'PRISMA_MODULE_OPTIONS',
      useFactory,
      inject,
    };
    const ServiceProvider: Provider<PrismaService> = {
      provide: PrismaService,
      useFactory: (options: PrismaModuleOptions) => {
        const { url, enableLog = true } = options;
        return new PrismaService(url, enableLog);
      },
      inject: ['PRISMA_MODULE_OPTIONS'],
    };
    return {
      global: true,
      module: PrismaModule,
      imports,
      providers: [ModuleOptionsProvider, ServiceProvider],
      exports: [ServiceProvider],
    };
  }
}

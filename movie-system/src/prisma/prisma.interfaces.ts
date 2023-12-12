export interface PrismaModuleOptions {
  url: string;
  enableLog?: boolean;
}

export interface PrismaAsyncModuleOptions {
  inject?: any[];
  imports?: any[];
  useFactory: (...args: any[]) => Promise<PrismaModuleOptions> | PrismaModuleOptions;
}

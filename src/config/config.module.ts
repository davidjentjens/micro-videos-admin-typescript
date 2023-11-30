import { Module } from '@nestjs/common';
import {
    ConfigModuleOptions,
    ConfigModule as NestConfigModule,
} from '@nestjs/config';
import { join } from 'path';

@Module({})
export class ConfigModule extends NestConfigModule {
    static forRoot(options: ConfigModuleOptions = {}) {
        const { envFilePath, ...otherOptions } = options;

        const propsEnvFilePath = !envFilePath
            ? []
            : Array.isArray(envFilePath)
              ? envFilePath
              : [envFilePath];

        return super.forRoot({
            isGlobal: true,
            envFilePath: [
                ...propsEnvFilePath,
                join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV}`),
                join(process.cwd(), 'envs', '.env'),
            ],
            ...otherOptions,
        });
    }
}

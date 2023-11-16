import { config as readEnv } from 'dotenv'
import { join } from 'path'

interface DBEnv {
  dialect: any
  host: string
  logging: boolean
}

export class Config {
  static env: any = null

  static db (): DBEnv {
    Config.readEnv()

    return {
      dialect: 'sqlite' as any,
      host: Config.env.DB_HOST,
      logging: Config.env.DB_LOGGING === 'true'
    }
  }

  static readEnv (): void {
    if (Config.env) {
      return
    }

    Config.env = readEnv({
      path: join(__dirname, `../../../envs/.env.${process.env.NODE_ENV}`)
    }).parsed
  }
}
